
import { Link } from "@tanstack/react-router";
import { Check, Ellipsis, Pencil, Trash2 } from "lucide-react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";

type Task = {
  createdAt: string | number | Date;
  id: number;
  title: string;
  description: string;
  priority: string;
  completed?: boolean;
};

type Props = {
  task: Task;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
};

export const TaskCard = ({ task, onDelete, onComplete }: Props) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5 flex flex-col justify-between">
      <div className="relative">
        {task.completed && (
          <Check className="absolute top-2 right-2 text-green-500" />
        )}
        <h2 className="text-xl font-semibold">{task.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {task.description}
        </p>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              task.priority === "high"
                ? "bg-red-100 text-red-600"
                : task.priority === "mid"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>

          <span className="text-xs text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Menubar className="border-none bg-transparent p-0 self-start sm:self-auto">
          <MenubarMenu>
            <MenubarTrigger className="hover:bg-muted/50 rounded-md p-2">
              <Ellipsis className="w-5 h-5" />
            </MenubarTrigger>
            <MenubarContent className="w-36 rounded-lg border bg-white dark:bg-zinc-900 shadow-md">
              <MenubarItem className="flex items-center gap-2 hover:bg-muted px-3 py-2 text-sm rounded-md">
                <Pencil className="w-4 h-4 text-blue-500" />
                <Link to="/edit/$id" params={{ id: String(task.id) }}>
                  Edit Task
                </Link>
              </MenubarItem>
              <MenubarItem
                onClick={() => onDelete(task.id)}
                className="flex items-center gap-2 hover:bg-muted px-3 py-2 text-sm rounded-md"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="text-red-500">Delete</span>
              </MenubarItem>
              <MenubarItem
                onClick={() => onComplete(task.id)}
                className="flex items-center gap-2 hover:bg-muted px-3 py-2 text-sm rounded-md"
              >
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Mark Completed</span>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};
