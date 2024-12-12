import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import { createDb } from "@/db";
import { trivia } from "@/db/schema";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./trivia.routes";
import { OpenAIService } from "@/services/openai/client";


export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { db } = createDb(c.env);
  const trivia = await db.query.trivia.findMany();
  return c.json(trivia);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { category, difficulty } = c.req.valid("json");

  const openAIService = new OpenAIService(c.env.OPENAI_API_KEY || "");
  const generatedTrivia = await openAIService.generateTrivia({ category, difficulty });

  const triviaItem = {
    category,
    difficulty,
    question: generatedTrivia.question,
    answer: generatedTrivia.answer,
    tips: generatedTrivia.tips || [],
  };

  const [inserted] = await db.insert(trivia).values(triviaItem).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const triviaItem = await db.query.trivia.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!triviaItem) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(triviaItem, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const existing = await db.query.trivia.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!existing) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [updated] = await db
    .update(trivia)
    .set(updates)
    .where(eq(trivia.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { db } = createDb(c.env);
  const { id } = c.req.valid("param");

  const [deleted] = await db
    .delete(trivia)
    .where(eq(trivia.id, id))
    .returning();

  if (!deleted) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(deleted, HttpStatusCodes.OK);
};
