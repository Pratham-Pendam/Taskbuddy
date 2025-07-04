import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manual_entry")({
  component: RouteComponent,
});

function RouteComponent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("https://taskbuddy-1-j3rl.onrender.com/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to create task");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      navigate({ to: "/dashboard" });
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) return alert("Title is required");
    createTaskMutation.mutate();
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-muted px-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          📝 Add Task Manually
        </h1>

        <div className="flex flex-col gap-4 z-50">
          <Input
            placeholder="Title"
            className="text-base"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Description"
            className="text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="mid">Mid</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button className="mt-2" onClick={handleSubmit} disabled={createTaskMutation.isPending}>
            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
          </Button>

          {createTaskMutation.isError && (
            <p className="text-red-500 text-sm">
              {createTaskMutation.error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

