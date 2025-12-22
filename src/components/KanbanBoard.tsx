"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Trash2,
  Edit3,
  GripVertical,
  X,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Idea, IdeaStatus, IdeaPriority } from "@/lib/database.types";
import { transitions, fadeUp, scaleIn } from "@/lib/animations";
import { getIdeas, createIdea, updateIdea, deleteIdea } from "@/lib/supabase-service";

const columns: { id: IdeaStatus; title: string; icon: React.ReactNode }[] = [
  { id: "backlog", title: "Backlog", icon: <Clock className="w-4 h-4" /> },
  { id: "in_progress", title: "In Progress", icon: <AlertCircle className="w-4 h-4" /> },
  { id: "review", title: "Review", icon: <Edit3 className="w-4 h-4" /> },
  { id: "done", title: "Done", icon: <CheckCircle2 className="w-4 h-4" /> },
];

const priorityColors: Record<IdeaPriority, string> = {
  low: "bg-slate-500/20 text-slate-400",
  medium: "bg-primary/20 text-primary",
  high: "bg-red-500/20 text-red-400",
};

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
}

const IdeaCard = memo(function IdeaCard({ idea, onEdit, onDelete }: IdeaCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      layoutId={idea.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={transitions.fast}
      className="bg-card/80 backdrop-blur-sm border border-primary/10 rounded-xl p-4 group card-hover gpu-accelerate select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm truncate">{idea.title}</h4>
          {idea.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {idea.description}
            </p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={transitions.fast}
                className="absolute right-0 top-8 bg-card border border-primary/20 rounded-lg shadow-xl z-50 py-1 min-w-[120px]"
              >
                <button
                  onClick={() => {
                    onEdit(idea);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-primary/10 w-full"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(idea.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium uppercase", priorityColors[idea.priority])}>
          {idea.priority}
        </span>

        {idea.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {tag}
          </span>
        ))}

        {idea.due_date && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />
            {new Date(idea.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-primary/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {editingIdea ? "Edit Idea" : "New Idea"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="What's your idea?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Add more details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IdeaPriority)}
                className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="freelance, design, tech"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-primary/20 text-muted-foreground hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-black font-bold hover:from-primary hover:to-accent transition-colors"
            >
              {editingIdea ? "Save Changes" : "Add Idea"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function KanbanBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [addToColumn, setAddToColumn] = useState<IdeaStatus>("backlog");
  const [draggedIdea, setDraggedIdea] = useState<Idea | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<IdeaStatus | null>(null);
  const [activeColumn, setActiveColumn] = useState<IdeaStatus>("backlog"); // For mobile tabs

  // Fetch ideas from Supabase
  useEffect(() => {
    async function fetchIdeas() {
      setLoading(true);
      const data = await getIdeas();
      setIdeas(data);
      setLoading(false);
    }
    fetchIdeas();
  }, []);

  const getIdeasByStatus = (status: IdeaStatus) => {
    return ideas.filter(idea => idea.status === status);
  };

  const handleAddIdea = async (newIdea: Partial<Idea>) => {
    if (editingIdea) {
      // Update existing
      const updated = await updateIdea(editingIdea.id, newIdea);
      if (updated) {
        setIdeas(prev => prev.map(idea =>
          idea.id === editingIdea.id ? updated : idea
        ));
      }
    } else {
      // Add new
      const created = await createIdea({
        ...newIdea,
        order_index: getIdeasByStatus(newIdea.status || "backlog").length,
      });
      if (created) {
        setIdeas(prev => [...prev, created]);
      }
    }
    setEditingIdea(null);
  };

  const handleDeleteIdea = async (id: string) => {
    const success = await deleteIdea(id);
    if (success) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const handleDragStart = (e: React.DragEvent, idea: Idea) => {
    setDraggedIdea(idea);
    e.dataTransfer.effectAllowed = "move";
    // Add visual feedback to dragged element
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => {
      target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
    setDraggedIdea(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: IdeaStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the column entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: IdeaStatus) => {
    e.preventDefault();
    if (draggedIdea && draggedIdea.status !== status) {
      setIdeas(prev => prev.map(idea =>
        idea.id === draggedIdea.id
          ? { ...idea, status, updated_at: new Date().toISOString() }
          : idea
      ));
    }
    setDraggedIdea(null);
    setDragOverColumn(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-500">
            Idea Board
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1 hidden md:block">
            Drag and drop to organize your hustles
          </p>
        </div>
        <button
          onClick={() => {
            setEditingIdea(null);
            setAddToColumn(activeColumn);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-black font-bold hover:from-primary hover:to-accent transition-colors shadow-lg shadow-primary/20 text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Idea</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Mobile Column Tabs */}
      <div className="flex md:hidden gap-1 mb-4 overflow-x-auto pb-2">
        {columns.map(column => (
          <button
            key={column.id}
            onClick={() => setActiveColumn(column.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              activeColumn === column.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-card/50 text-muted-foreground border border-transparent"
            )}
          >
            {column.icon}
            <span>{column.title}</span>
            <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full ml-1">
              {getIdeasByStatus(column.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile: Single Column View */}
      <div className="flex-1 md:hidden overflow-y-auto">
        <div className="space-y-3">
          {getIdeasByStatus(activeColumn).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No ideas in {columns.find(c => c.id === activeColumn)?.title}</p>
              <p className="text-xs mt-1">Tap &quot;Add&quot; to create one</p>
            </div>
          ) : (
            getIdeasByStatus(activeColumn).map(idea => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onEdit={(idea) => {
                  setEditingIdea(idea);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteIdea}
              />
            ))
          )}
        </div>
      </div>

      {/* Desktop: Grid Columns */}
      <div className="flex-1 hidden md:grid md:grid-cols-4 gap-4 overflow-hidden">
        {columns.map(column => (
          <motion.div
            key={column.id}
            animate={{
              scale: dragOverColumn === column.id ? 1.02 : 1,
              borderColor: dragOverColumn === column.id ? "rgba(245, 158, 11, 0.5)" : "rgba(245, 158, 11, 0.1)",
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex flex-col bg-background/50 rounded-2xl border overflow-hidden transition-shadow min-w-[280px] md:min-w-0 snap-center shrink-0 md:shrink",
              dragOverColumn === column.id && "shadow-lg shadow-primary/20"
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="px-4 py-3 border-b border-primary/10 flex items-center justify-between bg-card/30">
              <div className="flex items-center gap-2">
                <span className="text-primary">{column.icon}</span>
                <h3 className="font-semibold text-white text-sm">{column.title}</h3>
                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                  {getIdeasByStatus(column.id).length}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingIdea(null);
                  setAddToColumn(column.id);
                  setIsModalOpen(true);
                }}
                className="p-1 hover:bg-primary/10 rounded text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {/* Drop indicator at top */}
              {dragOverColumn === column.id && draggedIdea && draggedIdea.status !== column.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 60 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-2 border-dashed border-primary/50 rounded-xl bg-primary/5 flex items-center justify-center"
                >
                  <span className="text-xs text-primary">Drop here</span>
                </motion.div>
              )}

              <AnimatePresence mode="popLayout">
                {getIdeasByStatus(column.id).map(idea => (
                  <div
                    key={idea.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idea)}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: draggedIdea?.id === idea.id ? 0.5 : 1,
                        y: 0,
                        scale: draggedIdea?.id === idea.id ? 1.02 : 1,
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IdeaCard
                        idea={idea}
                        onEdit={(idea) => {
                          setEditingIdea(idea);
                          setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteIdea}
                      />
                    </motion.div>
                  </div>
                ))}
              </AnimatePresence>

              {getIdeasByStatus(column.id).length === 0 && !dragOverColumn && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p>No ideas yet</p>
                  <p className="text-xs mt-1">Drop an idea here</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddIdeaModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingIdea(null);
            }}
            onAdd={handleAddIdea}
            editingIdea={editingIdea}
            defaultStatus={addToColumn}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
