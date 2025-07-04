import {
  useState,
  type JSXElementConstructor,
  type Key,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
  type SetStateAction,
} from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "@/components/ui/menubar";
import { MenubarItem } from "@radix-ui/react-menubar";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { FloatingAddButton } from "@/components/FloatingAddButton";
import { TaskCard } from "@/components/TaskCard";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  type Task = {
    id: number;
    title: string;
    description: string;
    priority: string;
     createdAt: string;
    completed: boolean;
  };
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPriority, setEditedPriority] = useState("mid");

  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("https://taskbuddy-1-j3rl.onrender.com/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
       return data.tasks;
    },
  });

  const deleteMutation = useMutation<number, Error, number>({
    mutationFn: async (id: number) => {
      const res = await fetch(`https://taskbuddy-1-j3rl.onrender.com/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const completeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`https://taskbuddy-1-j3rl.onrender.com/tasks/complete/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      if (!res.ok) throw new Error("Failed to mark as completed");
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });


  const filteredTasks = tasks.filter(
    (task: { completed: boolean; priority: string; title: string }) => {
      const matchesPriority =
        priorityFilter === "all" ||
        (priorityFilter === "Completed"
          ? task.completed === true
          : task.priority.toLowerCase() === priorityFilter);
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesPriority && matchesSearch;
    }
  );
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);
  

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-muted rounded-xl shadow-sm">
        <Input
          placeholder="Search by title..."
          className="w-full md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="mid">Mid</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">📋 Your Tasks</h1>

        {isError ? (
          <p className="text-red-500 text-center">
            ❌ Failed to load tasks. Try again later.
          </p>
        ) : isLoading ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTasks.map(
              (taskRaw: {
                createdAt: string;
                id: any;
                title: any;
                description: any;
                priority: any;
                completed: any;
              }) => {
                if (
                  typeof taskRaw.id !== "number" ||
                  typeof taskRaw.title !== "string" ||
                  typeof taskRaw.description !== "string" ||
                  typeof taskRaw.priority !== "string"
                ) {
                  return null; // Skip invalid task
                }

                const task: Task = {
                  id: taskRaw.id,
                  title: taskRaw.title,
                  description: taskRaw.description,
                  priority: taskRaw.priority,
                    createdAt: taskRaw.createdAt, 
                  completed: !!taskRaw.completed, 
                };

                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    onComplete={(id) => completeMutation.mutate(id)}
                  />
                );
              }
            )}
          </div>
        )}
      </div>
      <FloatingAddButton onClick={openDialog} />
      <AddTaskDialog open={showDialog} onClose={closeDialog} />
    </div>
  );
}
