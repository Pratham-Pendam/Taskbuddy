import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { z } from "zod";
import { type Context } from "hono";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

const responseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "mid", "high"]),
});

export const aiTaskController = async (c: Context) => {
  const { prompt } = await c.req.json();

  if (!prompt) {
    return c.json({ error: "Prompt is required" }, 400);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let raw = "";
  try {
    const result = await model.generateContent(
      `Convert the following prompt into a JSON task object with: title, description, and priority (low, mid, or high). Only return a JSON object.\nPrompt: ${prompt}`
    );
    raw = result.response.text().trim();
  } catch (err: any) {
    return c.json({ error: "Gemini API call failed", detail: err.message }, 500);
  }

  let parsed;
  try {
    const cleaned = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return c.json({ error: "Gemini returned invalid JSON", raw }, 500);
  }

  const validated = responseSchema.safeParse(parsed);
  if (!validated.success) {
    console.error("❌ Validation failed", validated.error.format());
    return c.json({ error: "Invalid structured task", details: validated.error.format() }, 400);
  }

  const { title, description, priority } = validated.data;

  await db.insert(tasks).values({
    title,
    description,
    priority,
    createdAt: new Date().toISOString(),
  });

  return c.json({ success: true, message: "Task created from AI" });
};
