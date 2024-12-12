import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.use("*", cors());
  
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Trivia AI API",
      description: "API for managing trivia questions",
    },
    servers: [
      {
        url: "http://localhost:8787",
        description: "Local development server",
      },
    ],
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },
    }),
  );
}
