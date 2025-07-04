import { Hono } from "hono";
import { completeTaskController, createTaskController, deleteTaskController, editTaskController, getTaskByIdController } from "../../controllers/task";
import { tasks } from "@/db/schema";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import { aiTaskController } from "controllers/aiTask";

const taskRoutes = new Hono();

taskRoutes.post("/create", createTaskController);
taskRoutes.get("/edit/:id", getTaskByIdController);
taskRoutes.put("/edit/:id", editTaskController);    // PUT for update
taskRoutes.delete("/:id", deleteTaskController);
taskRoutes.patch("/complete/:id", completeTaskController);

taskRoutes.get("/", async (c) => {
  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  return c.json({ tasks: allTasks });
});
taskRoutes.post("/ai-create", aiTaskController);

export default taskRoutes;
