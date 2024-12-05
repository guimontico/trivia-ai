import { z } from "zod";

export function zodResponseFormat<T>(schema: z.ZodType<T>, key: string) {
  return {
    type: "json_object" as const,
    schema: {
      type: "object",
      properties: {
        [key]: schema.parse({}),
      },
      required: [key],
    },
  };
}
