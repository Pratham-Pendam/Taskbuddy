
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/ai_assistant_entry")({
  component: RouteComponent,
});

function RouteComponent() {
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
// For creating tasks using Ai
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("https://taskbuddy-1-j3rl.onrender.com/tasks/ai-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task via AI");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate({ to: "/dashboard" });
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-muted">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🧠 Add Task with AI</h1>
          <p className="text-muted-foreground text-sm">
            Describe what you want to do in plain language. I’ll turn it into a smart task.
          </p>
        </div>

        <div className="relative w-full">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Remind me to call the dentist on Monday"
            className="w-full pr-16 text-base py-4 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white"
          />
          <Button
            size="sm"
            onClick={() => mutation.mutate()}
            disabled={!input.trim() || mutation.isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {mutation.isPending && <p className="text-sm text-muted-foreground">Thinking...</p>}
        {mutation.isError && (
          <p className="text-sm text-red-500">Error: {mutation.error.message}</p>
        )}
      </div>
    </div>
  );
}
