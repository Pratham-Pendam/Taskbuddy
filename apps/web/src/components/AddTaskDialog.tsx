// components/AddTaskDialog.tsx
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddTaskDialog = ({ open, onClose }: AddTaskDialogProps) => {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add a New Task</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Choose how you want to add the task:
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="outline">
            <Link to="/manual_entry">Manual Entry</Link>
          </Button>
          <Button>
            <Link to="/ai_assistant_entry">Use AI Assistant</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
