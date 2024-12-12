import { z } from "zod";

export function createErrorSchema<T extends z.ZodType>(schema: T) {
  return z.object({
    message: z.string(),
    code: z.string().optional(),
    errors: z.array(
      z.object({
        code: z.string(),
        message: z.string(),
        path: z.array(z.string().or(z.number())),
      }).openapi({
        type: "object",
        properties: {
          code: { type: "string" },
          message: { type: "string" },
          path: { 
            type: "array",
            items: {
              oneOf: [
                { type: "string" },
                { type: "number" }
              ]
            }
          }
        }
      })
    ).optional(),
  }).openapi({
    type: "object",
    properties: {
      message: { type: "string" },
      code: { type: "string" },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            code: { type: "string" },
            message: { type: "string" },
            path: { 
              type: "array",
              items: {
                oneOf: [
                  { type: "string" },
                  { type: "number" }
                ]
              }
            }
          }
        }
      }
    }
  });
}
