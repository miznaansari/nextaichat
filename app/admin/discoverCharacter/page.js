"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  X,
  Check,
  Star,
  Users,
  Eye,
  EyeOff,
  Layers,
  Info,
  FolderPlus,
} from "lucide-react";

export default function AdminDiscoverCharacterPage() {
  const [characters, setCharacters] = useState([]);
  const [charSearchQuery, setCharSearchQuery] = useState("");
  const [selectedCharCategory, setSelectedCharCategory] = useState("All");
  const [loadingChars, setLoadingChars] = useState(true);
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState(null);
  const [submittingChar, setSubmittingChar] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("basic");

  // Custom Category State
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const [charFormData, setCharFormData] = useState({
    name: "",
    tagline: "",
    category: "Your Sales",
    filterGroup: "assistants",
    badge: "NEW",
    badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
    avatar:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    chatsCount: 0,
    rating: "4.9",
    story: "",
    isPublic: true,
    personas: [{ name: "", persona: "" }],
  });

  useEffect(() => {
    fetchAdminCharacters();
  }, []);

  const fetchAdminCharacters = async () => {
    try {
      setLoadingChars(true);
      const res = await fetch("/api/admin/discover-characters");
      if (res.ok) {
        const data = await res.json();
        setCharacters(data.characters || []);
      }
    } catch (err) {
      console.error("Failed to load admin characters", err);
    } finally {
      setLoadingChars(false);
    }
  };

  const defaultCategories = [
    "Your Sales",
    "Study & Education",
    "Anime",
    "Assistants",
    "Entertainment",
  ];

  const availableCategories = Array.from(
    new Set([
      ...defaultCategories,
      ...characters.map((c) => c.category).filter(Boolean),
      ...(customCategoryInput ? [customCategoryInput] : []),
    ])
  );

  const filterTabs = ["All", ...availableCategories];

  const handleOpenCreateCharModal = () => {
    setEditingChar(null);
    setActiveModalTab("basic");
    setIsCustomCategory(false);
    setCustomCategoryInput("");
    setCharFormData({
      name: "",
      tagline: "",
      category: "Your Sales",
      filterGroup: "assistants",
      badge: "NEW",
      badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
      avatar:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      chatsCount: 0,
      rating: "4.9",
      story: "",
      isPublic: true,
      personas: [{ name: "", persona: "" }],
    });
    setIsCharModalOpen(true);
  };

  const handleOpenEditCharModal = (char) => {
    setEditingChar(char);
    setActiveModalTab("basic");
    setIsCustomCategory(false);
    setCustomCategoryInput("");

    const parsedPersonas =
      Array.isArray(char.characters) && char.characters.length > 0
        ? char.characters
        : [{ name: char.name, persona: char.tagline }];

    setCharFormData({
      name: char.name || "",
      tagline: char.tagline || "",
      category: char.category || "Your Sales",
      filterGroup: char.filterGroup || "assistants",
      badge: char.badge || "NEW",
      badgeBg:
        char.badgeBg || "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
      avatar: char.avatar || "",
      chatsCount: char.chatsCount || 0,
      rating: char.rating || "4.9",
      story: char.story || "",
      isPublic: char.isPublic !== undefined ? char.isPublic : true,
      personas: parsedPersonas,
    });
    setIsCharModalOpen(true);
  };

  const handleAddPersonaRow = () => {
    setCharFormData((prev) => ({
      ...prev,
      personas: [...prev.personas, { name: "", persona: "" }],
    }));
  };

  const handleRemovePersonaRow = (index) => {
    setCharFormData((prev) => ({
      ...prev,
      personas: prev.personas.filter((_, i) => i !== index),
    }));
  };

  const handlePersonaChange = (index, field, value) => {
    setCharFormData((prev) => {
      const updated = [...prev.personas];
      updated[index][field] = value;
      return { ...prev, personas: updated };
    });
  };

  const handleDeleteCharacter = async (charId) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    try {
      const res = await fetch(`/api/admin/discover-characters/${charId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCharacters((prev) => prev.filter((c) => c.id !== charId));
      } else {
        alert("Failed to delete character");
      }
    } catch (err) {
      alert("Error deleting character");
    }
  };

  const handleSubmitCharacter = async (e) => {
    e.preventDefault();
    setSubmittingChar(true);

    const finalCategory = isCustomCategory
      ? customCategoryInput.trim() || charFormData.category
      : charFormData.category;

    const validPersonas = charFormData.personas
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        persona: p.persona.trim() || `${p.name} character persona description.`,
      }));

    if (validPersonas.length === 0) {
      validPersonas.push({
        name: charFormData.name.trim(),
        persona: charFormData.tagline.trim(),
      });
    }

    const payload = {
      name: charFormData.name.trim(),
      tagline: charFormData.tagline.trim(),
      category: finalCategory,
      filterGroup: charFormData.filterGroup,
      badge: charFormData.badge,
      badgeBg: charFormData.badgeBg,
      avatar: charFormData.avatar.trim(),
      chatsCount: parseInt(charFormData.chatsCount) || 0,
      rating: charFormData.rating,
      story: charFormData.story.trim(),
      isPublic: charFormData.isPublic,
      characters: validPersonas,
    };

    try {
      const url = editingChar
        ? `/api/admin/discover-characters/${editingChar.id}`
        : "/api/admin/discover-characters";
      const method = editingChar ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchAdminCharacters();
        setIsCharModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save character");
      }
    } catch (err) {
      alert("Error saving character");
    } finally {
      setSubmittingChar(false);
    }
  };

  const filteredCharacters = characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(charSearchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(charSearchQuery.toLowerCase());
    const matchesCategory =
      selectedCharCategory === "All" || c.category === selectedCharCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Discover Characters Showcase
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Route: /admin/discoverCharacter • Manage AI Characters & Custom Categories
          </p>
        </div>

        <button
          onClick={handleOpenCreateCharModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Discover Character</span>
        </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {filterTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCharCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCharCategory === cat
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search character by name..."
            value={charSearchQuery}
            onChange={(e) => setCharSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Characters Cards Grid */}
      {loadingChars ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
          <span className="text-xs font-mono text-slate-400">Loading Characters...</span>
        </div>
      ) : filteredCharacters.length === 0 ? (
        <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No Characters Found</p>
          <p className="text-xs text-slate-500 mt-1">Create your first Discover Character using the button above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((char) => (
            <div
              key={char.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={char.avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200"}
                      alt={char.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{char.name}</h3>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">
                        {char.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${char.badgeBg}`}
                  >
                    {char.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {char.tagline}
                </p>

                {/* Character Personas Badge Count */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                    👥 {Array.isArray(char.characters) ? char.characters.length : 1} Persona(s)
                  </span>
                  <span>⭐ {char.rating || "4.9"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {char.chatsCount || 0} Chats
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditCharModal(char)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-900 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCharacter(char.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Character Modal */}
      {isCharModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  {editingChar ? "Edit Discover Character" : "Create Discover Character"}
                </h3>
              </div>
              <button
                onClick={() => setIsCharModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveModalTab("basic")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeModalTab === "basic"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1. Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("personas")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeModalTab === "personas"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2. Roleplay Personas ({charFormData.personas.length})
              </button>
            </div>

            <form onSubmit={handleSubmitCharacter} className="space-y-4">
              {activeModalTab === "basic" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 font-mono">CHARACTER NAME</label>
                      <input
                        type="text"
                        value={charFormData.name}
                        onChange={(e) => setCharFormData({ ...charFormData, name: e.target.value })}
                        placeholder="e.g. Sales Expert Rahul"
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    {/* Category Input with Custom Category Creation */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-slate-400 font-mono">CATEGORY</label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomCategory(!isCustomCategory);
                            if (!isCustomCategory) {
                              setCustomCategoryInput("");
                            }
                          }}
                          className="text-[10px] text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
                        >
                          {isCustomCategory ? "Select Existing" : "+ Create New Category"}
                        </button>
                      </div>

                      {isCustomCategory ? (
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type new category name..."
                            value={customCategoryInput}
                            onChange={(e) => {
                              setCustomCategoryInput(e.target.value);
                              setCharFormData({ ...charFormData, category: e.target.value });
                            }}
                            className="w-full p-2.5 bg-slate-900 border border-purple-500/80 rounded-xl text-xs font-bold text-purple-200 focus:outline-none shadow-sm"
                            required
                          />
                        </div>
                      ) : (
                        <select
                          value={charFormData.category}
                          onChange={(e) => {
                            if (e.target.value === "__NEW__") {
                              setIsCustomCategory(true);
                              setCustomCategoryInput("");
                            } else {
                              setCharFormData({ ...charFormData, category: e.target.value });
                            }
                          }}
                          className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="__NEW__" className="text-purple-400 font-bold">
                            + Create New Category...
                          </option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-mono">TAGLINE / SHORT SUMMARY</label>
                    <input
                      type="text"
                      value={charFormData.tagline}
                      onChange={(e) => setCharFormData({ ...charFormData, tagline: e.target.value })}
                      placeholder="e.g. Expert closing strategist for cold calling and sales scripts."
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1 font-mono">AVATAR IMAGE URL</label>
                      <input
                        type="text"
                        value={charFormData.avatar}
                        onChange={(e) => setCharFormData({ ...charFormData, avatar: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1 font-mono">BADGE TEXT</label>
                      <input
                        type="text"
                        value={charFormData.badge}
                        onChange={(e) => setCharFormData({ ...charFormData, badge: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1 font-mono">STORY / INITIAL SCENARIO PROMPT</label>
                    <textarea
                      rows={4}
                      value={charFormData.story}
                      onChange={(e) => setCharFormData({ ...charFormData, story: e.target.value })}
                      placeholder="Describe the initial scenario and background context..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </>
              ) : (
                /* Personas Tab */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      CONFIGURE INDIVIDUAL CHARACTER PERSONAS IN SCENE
                    </span>
                    <button
                      type="button"
                      onClick={handleAddPersonaRow}
                      className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Persona</span>
                    </button>
                  </div>

                  {charFormData.personas.map((p, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                          Persona #{idx + 1}
                        </span>
                        {charFormData.personas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePersonaRow(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Character Name (e.g. Rahul)"
                          value={p.name}
                          onChange={(e) => handlePersonaChange(idx, "name", e.target.value)}
                          className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Persona Description / Role Prompt"
                          value={p.persona}
                          onChange={(e) => handlePersonaChange(idx, "persona", e.target.value)}
                          className="sm:col-span-2 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCharModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingChar}
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-purple-500/20"
                >
                  {submittingChar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Character</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
