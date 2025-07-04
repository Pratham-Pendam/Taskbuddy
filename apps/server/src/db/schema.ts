import { pgTable, text, integer,boolean } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: integer('id').primaryKey().notNull().generatedAlwaysAsIdentity(), 
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("low"),
  createdAt: text("created_at").notNull(),
  completed: boolean("completed").notNull().default(false),
});