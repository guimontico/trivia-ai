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

export const selectTasksSchema = createSelectSchema(tasks);

export const insertTasksSchema = createInsertSchema(
  tasks,
  {
    name: schema => schema.name.min(1).max(500),
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

export const selectTriviaSchema = createSelectSchema(trivia);

export const insertTriviaSchema = createInsertSchema(
  trivia,
  {
    question: schema => schema.question.min(1).max(1000),
    answer: schema => schema.answer.min(1).max(1000),
    tips: () => z.array(z.string()).min(1),
    category: schema => schema.category.min(1).max(100),
    difficulty: schema => schema.difficulty.min(1).max(100),
  },
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchTriviaSchema = insertTriviaSchema.partial();
