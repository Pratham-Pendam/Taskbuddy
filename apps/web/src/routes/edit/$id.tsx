
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react"; 

export const Route = createFileRoute("/edit/$id")({
  component: EditTaskPage,
});
function EditTaskPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await fetch(`https://taskbuddy-1-j3rl.onrender.com/tasks/edit/${id}`);// Fetches the task data 

      if (!res.ok) throw new Error("Failed to fetch task");
      return res.json();
    },
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
    }
  }, [task]);
// update editted tasks
  const updateTask = useMutation({
    mutationFn: async () => {
      const res = await fetch(`https://taskbuddy-1-j3rl.onrender.com/tasks/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });

      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate({ to: "/dashboard" });
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    updateTask.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="absolute top-4 right-4 text-zinc-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">✏️ Edit Task</h1>

        {isLoading ? (
          <p className="text-center">Loading task...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load task</p>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="mt-2"
              onClick={handleSubmit}
              disabled={updateTask.isPending}
            >
              {updateTask.isPending ? "Updating..." : "Update Task"}
            </Button>

            {updateTask.isError && (
              <p className="text-red-500 text-sm">
                {updateTask.error.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
