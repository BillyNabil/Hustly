"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Loader2,
  Layout,
  Filter,
  CircleDashed,
  AlertOctagon,
  ArrowRight,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import IdeaVisualizer from "@/components/IdeaVisualizer";
import { cn } from "@/lib/utils";
import { Idea, IdeaStatus, IdeaPriority } from "@/lib/database.types";
import { getIdeas, createIdea, updateIdea, deleteIdea } from "@/lib/supabase-service";

/* -------------------------------------------------------------------------- */
/*                                CONFIGURATION                               */
/* -------------------------------------------------------------------------- */

const columns: { id: IdeaStatus; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
  { id: "backlog", title: "Backlog", subtitle: "Raw Ideas", icon: <CircleDashed className="w-4 h-4" />, color: "text-zinc-400" },
  { id: "in_progress", title: "In Progress", subtitle: "Execution Mode", icon: <Loader2 className="w-4 h-4 animate-spin-slow" />, color: "text-blue-400" },
  { id: "review", title: "Review", subtitle: "Quality Check", icon: <AlertOctagon className="w-4 h-4" />, color: "text-amber-400" },
  { id: "done", title: "Done", subtitle: "Shipped & Live", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-400" },
];

const priorityConfig: Record<IdeaPriority, { color: string; bg: string; border: string; label: string }> = {
  low: { color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/30", label: "Low Priority" },
  medium: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Medium Priority" },
  high: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", label: "High Priority" },
};

const getTagColor = (tag: string) => {
  const colors = [
    "bg-red-500/10 text-red-400 border-red-500/20",
    "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "bg-green-500/10 text-green-400 border-green-500/20",
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "bg-teal-500/10 text-teal-400 border-teal-500/20",
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "bg-sky-500/10 text-sky-400 border-sky-500/20",
    "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
    "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "bg-rose-500/10 text-rose-400 border-rose-500/20",
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const IdeaCard = memo(function IdeaCard({ idea, onEdit, onDelete, isDragging }: IdeaCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const priorityStyle = priorityConfig[idea.priority];

  return (
    <motion.div
      layout
      layoutId={idea.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: isDragging ? 0.95 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative"
      onDoubleClick={() => onEdit(idea)}
    >
      {/* Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100",
        priorityStyle.bg.replace('/10', '/30') // Boost opacity for glow
      )} style={{ filter: "blur(20px)" }} />

      <div className={cn(
        "relative rounded-xl border p-4 backdrop-blur-xl transition-all duration-200 overflow-hidden",
        "bg-card/40 hover:bg-card/60",
        priorityStyle.border
      )}>
        {/* Priority Stripe */}
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", priorityStyle.bg.replace("bg-", "bg-"))} />

        <div className="pl-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", priorityStyle.color, priorityStyle.bg, priorityStyle.border)}>
              {idea.priority}
            </span>

            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-white"
              >
                <MoreHorizontal size={16} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute right-0 top-full mt-1 w-32 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <button onClick={(e) => { e.stopPropagation(); onEdit(idea); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 flex items-center gap-2">
                      <Edit3 size={12} /> Edit
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(idea.id); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Title & Desc */}
          <h4 className="font-semibold text-sm text-foreground mb-1 leading-snug">{idea.title}</h4>
          {idea.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {idea.description}
            </p>
          )}

          {/* Footer: Tags & Due Date */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div className="flex flex-wrap gap-1">
              {idea.tags.slice(0, 2).map(tag => (
                <span key={tag} className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium", getTagColor(tag))}>
                  #{tag}
                </span>
              ))}
              {idea.tags.length > 2 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/5 bg-white/5 text-zinc-500">
                  +{idea.tags.length - 2}
                </span>
              )}
            </div>

            {idea.due_date && (
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-mono",
                new Date(idea.due_date) < new Date() ? "text-red-400" : "text-zinc-500"
              )}>
                <Clock size={10} />
                {new Date(idea.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

interface AddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (idea: Partial<Idea>) => void;
  editingIdea?: Idea | null;
  defaultStatus?: IdeaStatus;
}

function AddIdeaModal({ isOpen, onClose, onAdd, editingIdea, defaultStatus = "backlog" }: AddIdeaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IdeaPriority>("medium");
  const [status, setStatus] = useState<IdeaStatus>(defaultStatus);
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingIdea) {
      setTitle(editingIdea.title);
      setDescription(editingIdea.description || "");
      setPriority(editingIdea.priority);
      setStatus(editingIdea.status);
      setTags(editingIdea.tags.join(", "));
      setDueDate(editingIdea.due_date || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus(defaultStatus);
      setTags("");
      setDueDate("");
    }
  }, [editingIdea, defaultStatus, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      id: editingIdea?.id,
      title: title.trim(),
      description: description.trim() || null,
      priority,
      status,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      due_date: dueDate || null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {editingIdea ? <Edit3 size={18} className="text-primary" /> : <Sparkles size={18} className="text-primary" />}
            {editingIdea ? "Edit Idea" : "New Idea"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</label>
            <input
              autoFocus
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
              placeholder="What's your brilliant idea?"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</label>
            <textarea
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all min-h-[100px] resize-none leading-relaxed text-sm"
              placeholder="Add some details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</label>
              <select
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
                value={priority}
                onChange={e => setPriority(e.target.value as IdeaPriority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</label>
              <select
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50"
                value={status}
                onChange={e => setStatus(e.target.value as IdeaStatus)}
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tags (Comma Sep)</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                <input
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 text-sm"
                  placeholder="marketing, dev..."
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                <input
                  type="date"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-primary/50 text-sm [&::-webkit-calendar-picker-indicator]:invert"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              {editingIdea ? "Save Changes" : "Create Idea"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export default function KanbanBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [addToColumn, setAddToColumn] = useState<IdeaStatus>("backlog");
  const [draggedIdea, setDraggedIdea] = useState<Idea | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<IdeaStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<IdeaStatus>("backlog"); // Mobile tab

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const data = await getIdeas();
      setIdeas(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const handleAddIdea = async (newIdea: Partial<Idea>) => {
    if (editingIdea) {
      const updated = await updateIdea(editingIdea.id!, newIdea);
      if (updated) setIdeas(prev => prev.map(i => i.id === editingIdea.id ? updated : i));
    } else {
      const created = await createIdea({ ...newIdea, order_index: ideas.length });
      if (created) setIdeas(prev => [...prev, created]);
    }
    setEditingIdea(null);
  };

  const handleDelete = async (id: string) => {
    if (await deleteIdea(id)) setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getColumnIdeas = (status: IdeaStatus) => filteredIdeas.filter(i => i.status === status);

  // Drag & Drop Handlers
  const onDragStart = (e: React.DragEvent, idea: Idea) => {
    setDraggedIdea(idea);
    e.dataTransfer.effectAllowed = "move";
    // Transparent ghost image
    const ghost = document.createElement('div');
    ghost.style.opacity = '0';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const onDragOver = (e: React.DragEvent, status: IdeaStatus) => {
    e.preventDefault();
    if (dragOverColumn !== status) setDragOverColumn(status);
  };

  const onDrop = async (e: React.DragEvent, status: IdeaStatus) => {
    e.preventDefault();
    if (draggedIdea && draggedIdea.status !== status) {
      // Optimistic update
      setIdeas(prev => prev.map(i => i.id === draggedIdea.id ? { ...i, status, updated_at: new Date().toISOString() } : i));

      // Actual update (silent)
      await updateIdea(draggedIdea.id, { status });
    }
    setDraggedIdea(null);
    setDragOverColumn(null);
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Visualizer Section */}
      <div className="mb-8">
        <IdeaVisualizer />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search ideas by title or tag..."
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/30 transition-all placeholder:text-zinc-600"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={() => { setEditingIdea(null); setAddToColumn("backlog"); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-black font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          <span>New Idea</span>
        </button>
      </div>

      {/* Mobile Tabs */}
      <div className="flex md:hidden gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
        {columns.map(col => (
          <button
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all",
              activeTab === col.id
                ? "bg-white text-black border-white"
                : "bg-transparent text-zinc-500 border-white/10"
            )}
          >
            {col.title} <span className="opacity-60">({getColumnIdeas(col.id).length})</span>
          </button>
        ))}
      </div>

      {/* Board Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-6 min-w-[300px] md:min-w-[1000px]">
          {/* Mobile: Only show active column. Desktop: Show all */}
          {columns.map(col => (
            <div
              key={col.id}
              className={cn(
                "flex-col h-full min-h-0 bg-[#0A0A0A]/50 rounded-2xl border border-white/5 backdrop-blur-sm transition-colors",
                dragOverColumn === col.id ? "bg-primary/5 border-primary/20" : "",
                // Hide inactive columns on mobile
                "hidden md:flex",
                activeTab === col.id ? "flex" : ""
              )}
              onDragOver={e => onDragOver(e, col.id)}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={e => onDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5", col.color)}>
                    {col.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-200">{col.title}</h3>
                    <p className="text-[10px] text-zinc-600 font-mono">{col.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded-md">
                  {getColumnIdeas(col.id).length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                  {getColumnIdeas(col.id).map(idea => (
                    <div
                      key={idea.id}
                      draggable
                      onDragStart={e => onDragStart(e, idea)}
                      className={cn("touch-none", draggedIdea?.id === idea.id && "opacity-30 grayscale")}
                    >
                      <IdeaCard
                        idea={idea}
                        onEdit={idea => { setEditingIdea(idea); setIsModalOpen(true); }}
                        onDelete={handleDelete}
                        isDragging={draggedIdea?.id === idea.id}
                      />
                    </div>
                  ))}
                </AnimatePresence>

                {getColumnIdeas(col.id).length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl m-1">
                    <p className="text-xs text-zinc-700 font-medium">No ideas yet</p>
                    <button
                      onClick={() => { setEditingIdea(null); setAddToColumn(col.id); setIsModalOpen(true); }}
                      className="mt-2 text-[10px] text-primary hover:underline font-bold tracking-wide uppercase"
                    >
                      + Add One
                    </button>
                  </div>
                )}

                {/* Drop Zone Indicator */}
                {dragOverColumn === col.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 100 }}
                    className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 w-full flex items-center justify-center"
                  >
                    <p className="text-primary text-xs font-bold uppercase tracking-wider">Drop Here</p>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddIdea}
        editingIdea={editingIdea}
        defaultStatus={addToColumn}
      />
    </div>
  );
}
