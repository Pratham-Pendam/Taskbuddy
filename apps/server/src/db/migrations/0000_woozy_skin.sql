CREATE TABLE "tasks" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" text DEFAULT 'low',
	"created_at" text NOT NULL
);
