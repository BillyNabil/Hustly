"use client";

import { useState, memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Target,
  X,
  Trash2,
  Edit3,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ImagePlus,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Goal } from "@/lib/database.types";
import { transitions, fadeUp, staggerContainer, modalOverlay, modalContent } from "@/lib/animations";
import { getGoals, createGoal, updateGoal, deleteGoal } from "@/lib/supabase-service";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Partial<Goal>) => void;
  editingGoal?: Goal | null;
}

function GoalModal({ isOpen, onClose, onSave, editingGoal }: GoalModalProps) {
  const [title, setTitle] = useState(editingGoal?.title || "");
  const [description, setDescription] = useState(editingGoal?.description || "");
  const [targetAmount, setTargetAmount] = useState(editingGoal?.target_amount?.toString() || "");
  const [currentAmount, setCurrentAmount] = useState(editingGoal?.current_amount?.toString() || "0");
  const [imageUrl, setImageUrl] = useState(editingGoal?.image_url || "");
  const [deadline, setDeadline] = useState(editingGoal?.deadline || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    onSave({
      id: editingGoal?.id,
      title,
      description: description || null,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount) || 0,
      image_url: imageUrl || null,
      deadline: deadline || null,
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {editingGoal ? "Edit Goal" : "New Goal"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Goal Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="What do you want to achieve?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Why is this important to you?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Target Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Current Saved ($)</label>
              <input
                type="number"
                step="0.01"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Image URL (optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
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
              {editingGoal ? "Save Changes" : "Create Goal"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

interface AddProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal;
  onAdd: (amount: number) => void;
}

function AddProgressModal({ isOpen, onClose, goal, onAdd }: AddProgressModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onAdd(parseFloat(amount));
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  const remaining = Number(goal.target_amount) - Number(goal.current_amount);

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
        className="bg-card border border-primary/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-2">Add Progress</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Adding to: <span className="text-primary">{goal.title}</span>
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Remaining: <span className="text-white font-bold">${remaining.toLocaleString()}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-3 text-white text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="$0.00"
            required
            autoFocus
          />

          <div className="flex gap-2">
            {[50, 100, 250].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                +${preset}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-primary/20 text-muted-foreground hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-400 hover:to-green-500 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onAddProgress: (goal: Goal) => void;
}

function GoalCard({ goal, onEdit, onDelete, onAddProgress }: GoalCardProps) {
  const progress = Math.min((Number(goal.current_amount) / Number(goal.target_amount)) * 100, 100);
  const remaining = Math.max(Number(goal.target_amount) - Number(goal.current_amount), 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all group",
        goal.is_completed
          ? "border-green-500/30 bg-green-500/5"
          : "border-primary/10 bg-card/80"
      )}
    >
      {/* Image */}
      {goal.image_url ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={goal.image_url}
            alt={goal.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Progress overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full",
                goal.is_completed
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-primary to-accent"
              )}
            />
          </div>
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center">
          <ImagePlus className="w-10 h-10 text-primary/30" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              {goal.title}
              {goal.is_completed && (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              )}
            </h3>
            {goal.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {goal.description}
              </p>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-white"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className={cn(
              "font-bold",
              goal.is_completed ? "text-green-400" : "text-primary"
            )}>
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                goal.is_completed
                  ? "bg-gradient-to-r from-green-400 to-green-500"
                  : "bg-gradient-to-r from-primary to-accent"
              )}
            />
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-white">
              ${Number(goal.current_amount).toLocaleString()}
              <span className="text-sm text-muted-foreground font-normal">
                {" "}/ ${Number(goal.target_amount).toLocaleString()}
              </span>
            </p>
            {goal.deadline && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>

          {!goal.is_completed && (
            <button
              onClick={() => onAddProgress(goal)}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-black text-sm font-bold hover:from-primary hover:to-accent transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Completion Celebration */}
      {goal.is_completed && (
        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Achieved!
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function VisionBoard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [progressGoal, setProgressGoal] = useState<Goal | null>(null);

  // Fetch goals from Supabase
  useEffect(() => {
    async function fetchGoals() {
      setLoading(true);
      const data = await getGoals();
      setGoals(data);
      setLoading(false);
    }
    fetchGoals();
  }, []);

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0);
  const completedGoals = goals.filter(g => g.is_completed).length;

  const handleSaveGoal = async (data: Partial<Goal>) => {
    if (editingGoal) {
      const isCompleted = Number(data.current_amount) >= Number(data.target_amount);
      const updated = await updateGoal(editingGoal.id, { ...data, is_completed: isCompleted });
      if (updated) {
        setGoals(prev => prev.map(g => g.id === editingGoal.id ? updated : g));
      }
    } else {
      const isCompleted = Number(data.current_amount || 0) >= Number(data.target_amount);
      const created = await createGoal({ ...data, is_completed: isCompleted });
      if (created) {
        setGoals(prev => [created, ...prev]);
      }
    }
    setEditingGoal(null);
  };

  const handleAddProgress = async (amount: number) => {
    if (!progressGoal) return;
    
    const newAmount = Number(progressGoal.current_amount) + amount;
    const isCompleted = newAmount >= Number(progressGoal.target_amount);
    
    const updated = await updateGoal(progressGoal.id, { 
      current_amount: newAmount, 
      is_completed: isCompleted 
    });
    
    if (updated) {
      setGoals(prev => prev.map(g => g.id === progressGoal.id ? updated : g));
    }
  };

  const handleDeleteGoal = async (id: string) => {
    const success = await deleteGoal(id);
    if (success) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-500">
            Vision Board
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visualize your goals and track progress
          </p>
        </div>
        <button
          onClick={() => {
            setEditingGoal(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-black font-bold hover:from-primary hover:to-accent transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-panel p-4 rounded-2xl border border-primary/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Goals</p>
          <p className="text-2xl font-bold text-white">{goals.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-primary/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Saved</p>
          <p className="text-2xl font-bold text-primary">${totalSaved.toLocaleString()}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-green-500/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-400">{completedGoals}</p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(g) => {
                  setEditingGoal(g);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteGoal}
                onAddProgress={setProgressGoal}
              />
            ))}
          </AnimatePresence>
        </div>

        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Target className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">No goals yet</p>
            <p className="text-sm">Create your first milestone to start tracking!</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <GoalModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingGoal(null);
            }}
            onSave={handleSaveGoal}
            editingGoal={editingGoal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {progressGoal && (
          <AddProgressModal
            isOpen={!!progressGoal}
            onClose={() => setProgressGoal(null)}
            goal={progressGoal}
            onAdd={handleAddProgress}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
