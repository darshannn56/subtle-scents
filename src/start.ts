import { createStart, createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const csrfMiddleware = createMiddleware().server(async (ctx) => {
  if (ctx.handlerType !== "serverFn") {
    return ctx.next();
  }

  const request = ctx.request ?? getRequest();
  const method = request.method.toUpperCase();

  if (method === "GET" || method === "HEAD") {
    return ctx.next();
  }

  const currentOrigin = new URL(request.url).origin;
  const originHeader = request.headers.get("Origin");

  if (originHeader !== null) {
    if (originHeader !== currentOrigin) {
      return new Response("Forbidden", { status: 403 });
    }

    return ctx.next();
  }

  const refererHeader = request.headers.get("Referer");
  if (!refererHeader) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const refererOrigin = new URL(refererHeader).origin;
    if (refererOrigin !== currentOrigin) {
      return new Response("Forbidden", { status: 403 });
    }
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  return ctx.next();
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
