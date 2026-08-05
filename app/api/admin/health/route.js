import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

export async function GET(req) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    // Only proxy if PRIMARY_APP_URL is explicitly set and NOT pointing to default external domain
    if (process.env.PRIMARY_APP_URL && process.env.PRIMARY_APP_URL !== "https://app.nextaichat.online") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const appRes = await fetch(`${process.env.PRIMARY_APP_URL}/api/admin/health`, {
          headers: {
            cookie: req.headers.get("cookie") || "",
            authorization: req.headers.get("authorization") || "",
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (appRes.ok) {
          const appHealthData = await appRes.json();
          if (appHealthData.recentMetrics && appHealthData.recentMetrics.length > 0) {
            return NextResponse.json(appHealthData);
          }
        }
      } catch (e) {
        // Fallback to local DB system metrics
      }
    }

    // Compute metrics from shared MySQL SystemMetric records
    const now = new Date();
    const YYYY = now.getUTCFullYear();
    const MM = String(now.getUTCMonth() + 1).padStart(2, "0");
    const DD = String(now.getUTCDate()).padStart(2, "0");
    const HH = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    const currentMinuteBucket = `${YYYY}-${MM}-${DD} ${HH}:${mm}`;

    // Ensure current minute metric entry exists in DB
    try {
      await prisma.systemMetric.upsert({
        where: { minuteBucket: currentMinuteBucket },
        update: {},
        create: {
          id: currentMinuteBucket,
          minuteBucket: currentMinuteBucket,
          requestCount: 0,
          queuedCount: 0,
        },
      });
    } catch (e) {
      // Ignore potential concurrency constraint errors
    }

    const currentMetric = await prisma.systemMetric.findUnique({
      where: { minuteBucket: currentMinuteBucket },
    });

    let recentMetrics = await prisma.systemMetric.findMany({
      take: 60,
      orderBy: { createdAt: "desc" },
    });

    // Ensure a full 60-minute window (60 recorded minute buckets) is always returned
    const existingBuckets = new Set(recentMetrics.map((m) => m.minuteBucket));
    const filledMetrics = [...recentMetrics];

    for (let i = 0; i < 60; i++) {
      const pastTime = new Date(now.getTime() - i * 60 * 1000);
      const yyyy = pastTime.getUTCFullYear();
      const mMonth = String(pastTime.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(pastTime.getUTCDate()).padStart(2, "0");
      const hh = String(pastTime.getUTCHours()).padStart(2, "0");
      const min = String(pastTime.getUTCMinutes()).padStart(2, "0");
      const bucketStr = `${yyyy}-${mMonth}-${dd} ${hh}:${min}`;

      if (!existingBuckets.has(bucketStr)) {
        filledMetrics.push({
          id: bucketStr,
          minuteBucket: bucketStr,
          requestCount: 0,
          queuedCount: 0,
          createdAt: pastTime,
          updatedAt: pastTime,
        });
      }
    }

    filledMetrics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    recentMetrics = filledMetrics.slice(0, 60);

    const maxLimit = parseInt(process.env.AI_MAX_REQUESTS_PER_MIN || "15", 10);
    const activeInLastMin = currentMetric ? currentMetric.requestCount : (recentMetrics[0]?.requestCount || 0);
    const queuedCount = currentMetric ? currentMetric.queuedCount : (recentMetrics[0]?.queuedCount || 0);
    const isHighDemand = activeInLastMin >= maxLimit || queuedCount > 0;

    const processUptimeSeconds = process.uptime();
    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      status: isHighDemand ? "high_demand" : "healthy",
      uptimeSeconds: processUptimeSeconds,
      formattedUptime: formatUptime(processUptimeSeconds),
      serverTimestamp: new Date().toISOString(),
      rateQueue: {
        maxLimit,
        activeInLastMin,
        queuedCount,
        isHighDemand,
      },
      memory: {
        rssMb: (memoryUsage.rss / (1024 * 1024)).toFixed(2),
        heapTotalMb: (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsedMb: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2),
      },
      recentMetrics: [...recentMetrics].reverse(),
    });
  } catch (error) {
    console.error("NextAiChat Admin Health API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch health metrics" },
      { status: 500 }
    );
  }
}
