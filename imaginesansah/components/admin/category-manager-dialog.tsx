"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Check, X, ChevronUp, ChevronDown, Loader2, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCategory,
  renameCategory,
  deleteCategory,
  reorderCategories,
} from "@/lib/actions/categories";
import type { Category } from "@/types/domain";

export function CategoryManagerDialog({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(categories);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Stay in sync when the parent Server Component re-fetches (triggered by
  // router.refresh() below) after a mutation lands.
  useEffect(() => {
    setItems(categories);
  }, [categories]);

  function handleAdd() {
    if (!newName.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await createCategory(newName.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      setNewName("");
      router.refresh();
    });
  }

  function handleRename(id: string) {
    if (!editValue.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await renameCategory(id, editValue.trim());
      if (result.error) {
        setError(result.error);
        return;
      }
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    setError(null);
    setItems((prev) => prev.filter((c) => c.id !== id));
    startTransition(async () => {
      await deleteCategory(id);
      router.refresh();
    });
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(async () => {
      await reorderCategories(next.map((c) => c.id));
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) setItems(categories); }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-admin-border bg-admin-panel text-admin-text hover:bg-admin-secondary"
        >
          <Tag className="mr-1.5 h-4 w-4" /> Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="border-admin-border bg-admin-panel text-admin-text">
        <DialogHeader>
          <DialogTitle className="text-admin-text">Categories</DialogTitle>
        </DialogHeader>

        {error && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 p-2.5 font-mono text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          {items.length === 0 && (
            <p className="py-4 text-center font-mono text-xs text-admin-muted">
              No categories yet — add one below.
            </p>
          )}
          {items.map((cat, i) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 rounded-md border border-admin-border bg-admin-bg px-3 py-2"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || pending}
                  aria-label="Move up"
                  className="text-admin-muted hover:text-admin-text disabled:opacity-30"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1 || pending}
                  aria-label="Move down"
                  className="text-admin-muted hover:text-admin-text disabled:opacity-30"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              {editingId === cat.id ? (
                <>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 flex-1 border-admin-border bg-admin-panel text-sm text-admin-text"
                    autoFocus
                  />
                  <button
                    onClick={() => handleRename(cat.id)}
                    disabled={pending}
                    aria-label="Save"
                    className="text-admin-green"
                  >
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                    className="text-admin-muted hover:text-admin-text"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 truncate font-body text-sm text-admin-text">{cat.name}</span>
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditValue(cat.name);
                    }}
                    aria-label={`Rename ${cat.name}`}
                    className="text-admin-muted hover:text-admin-text"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={pending}
                    aria-label={`Delete ${cat.name}`}
                    className="text-admin-muted hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-admin-border pt-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
            placeholder="New category name"
            className="border-admin-border bg-admin-bg text-admin-text"
          />
          <Button
            onClick={handleAdd}
            disabled={pending || !newName.trim()}
            className="shrink-0 bg-admin-green text-admin-onPrimary hover:bg-admin-green/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
