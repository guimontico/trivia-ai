import { sqliteTable, AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const tasks = sqliteTable("tasks", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	name: text("name").notNull(),
	done: integer("done").default(false).notNull(),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
});

export const trivia = sqliteTable("trivia", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	tips: text("tips").notNull(),
	category: text("category").notNull(),
	difficulty: text("difficulty").notNull(),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
});