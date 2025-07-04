
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import taskRoutes from "./routers/index";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => c.text("Hello from Hono!"));
app.route("/tasks", taskRoutes);

serve({ fetch: app.fetch, port: 3000 }, ({ port }) => {
  console.log(`Server running on http://localhost:${port}`);
});
