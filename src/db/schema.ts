import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text("name")
    .notNull(),
  done: integer("done", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks).extend({
  id: z.number(),
  name: z.string(),
  done: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertTasksSchema = createInsertSchema(
  tasks,
  {
    name: schema => schema.name.min(1).max(500).openapi({ type: "string", description: "Task name", minLength: 1, maxLength: 500 }),
  },
).required({
  done: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchTasksSchema = insertTasksSchema.partial();

export const trivia = sqliteTable("trivia", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  question: text("question")
    .notNull(),
  answer: text("answer")
    .notNull(),
  tips: text("tips", { mode: "json" })
    .notNull(),
  category: text("category")
    .notNull(),
  difficulty: text("difficulty")
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectTriviaSchema = createSelectSchema(trivia).extend({
  id: z.number(),
  question: z.string(),
  answer: z.string(),
  tips: z.array(z.string()),
  category: z.string(),
  difficulty: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertTriviaSchema = createInsertSchema(
  trivia,
  {
    category: schema => schema.category.min(1).max(100).openapi({ type: "string", description: "Trivia category", minLength: 1, maxLength: 100 }),
    difficulty: schema => schema.difficulty.min(1).max(100).openapi({ type: "string", description: "Trivia difficulty", minLength: 1, maxLength: 100 }),
  }
).pick({
  category: true,
  difficulty: true,
});

export const patchTriviaSchema = insertTriviaSchema.partial();
