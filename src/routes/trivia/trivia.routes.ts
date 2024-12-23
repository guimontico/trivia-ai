import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { IdParamsSchema } from "stoker/openapi/schemas";

import { insertTriviaSchema, selectTriviaSchema } from "@/db/schema";
import { createErrorSchema } from "@/lib/openapi";

const tags = ["Trivia"];

export const list = createRoute({
  path: "/trivia",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTriviaSchema),
      "The list of trivia questions",
    ),
  },
});

export const create = createRoute({
  path: "/trivia",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertTriviaSchema.extend({
        difficulty: z.enum(["easy", "medium", "hard"]),
      }).pick({
        category: true,
        difficulty: true,
      }),
      "The trivia question parameters",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTriviaSchema,
      "The created trivia question",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTriviaSchema.extend({
        difficulty: z.enum(["easy", "medium", "hard"]),
      }).pick({
        category: true,
        difficulty: true,
      })),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/trivia/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTriviaSchema,
      "The trivia question",
    ),
    [HttpStatusCodes.NOT_FOUND]: {
      description: "Trivia question not found",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export const patch = createRoute({
  path: "/trivia/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      insertTriviaSchema.partial(),
      "The trivia question updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTriviaSchema,
      "The updated trivia question",
    ),
    [HttpStatusCodes.NOT_FOUND]: {
      description: "Trivia question not found",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTriviaSchema.partial())
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/trivia/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Trivia question deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: {
      description: "Trivia question not found",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
