import { z } from "zod";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "mid", "high"]).default("low"),
});
const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "mid", "high"]).optional(),
  completed: z.boolean().optional(), // ✅ include this
});

export const createTaskController = async (c: Context) => {
  const body = await c.req.json();
  const parsed = taskSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.format() }, 400);
  }

  const { title, description, priority } = parsed.data;

  await db.insert(tasks).values({
    title,
    description,
    priority,
    createdAt: new Date().toISOString(),
  });

  return c.json({ success: true, message: "Task created" });
};


export const editTaskController = async (c: Context) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.format() }, 400);
  }

  const updatedData = parsed.data;

  const result = await db
    .update(tasks)
    .set(updatedData)
    .where(eq(tasks.id, Number(id)))
    .returning();

  if (result.length === 0) {
    return c.json({ error: "Task not found" }, 404);
  }

  return c.json({ success: true, message: "Task updated" });
};


// Delete
export const deleteTaskController = async (c: Context) => {
  const id = Number(c.req.param("id"));

  const result = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning(); // ← call it!

  if (result.length === 0) {
    return c.json({ error: "Task not found" }, 404);
  }

  return c.json({ success: true, message: "Task deleted" });
};
// getTasks
export const getTaskByIdController = async (c:Context) => {
  const id = c.req.param("id");

  // Query the tasks table using Drizzle ORM
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, Number(id)));

  const task = result[0];

  if (!task) {
    return c.json({ error: "Task not found" }, 404);
  }

  return c.json(task);
};
// completed
export const completeTaskController = async (c: Context) => {
  const id = Number(c.req.param("id"));

  const result = await db
    .update(tasks)
    .set({ completed: true }) // ← Mark completed
    .where(eq(tasks.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: "Task not found" }, 404);
  }

  return c.json({ success: true, message: "Task marked as completed" });
};
