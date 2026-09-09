"use client";

import { useLoggerStore, genLogId } from "./logger-store";
import { shouldIgnoreNetworkUrl } from "./ignore-rules";

let patched = false;

const safeParseResponse = async (res: Response) => {
  try {
    const text = await res.clone().text();

    if (!text.trim()) return undefined;

    // Normal JSON
    try {
      return JSON.parse(text);
    } catch {
      // Continue
    }

    // Next.js RSC / React Flight
    const lines = text.split("\n");
    const parsedResponses: unknown[] = [];

    for (const line of lines) {
      const match = line.match(/^\d+:(\{.*\})$/);

      if (!match) continue;

      try {
        parsedResponses.push(JSON.parse(match[1]));
      } catch {
        // Ignore invalid JSON
      }
    }

    const apiResponse = parsedResponses.findLast(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        ("state" in item || "data" in item || "error" in item),
    );

    if (apiResponse) {
      return apiResponse;
    }

    // Otherwise return the last parsed JSON
    return parsedResponses.at(-1) ?? text.slice(0, 2000);
  } catch {
    return undefined;
  }
};

const safeStringifyBody = (body: unknown) => {
  if (!body) return undefined;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  if (body instanceof FormData) {
    const obj: Record<string, unknown> = {};
    body.forEach((value, key) => {
      obj[key] = value instanceof File ? `File(${value.name})` : value;
    });
    return obj;
  }
  return body;
};

export const patchNetwork = () => {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const [input, init] = args;
    const url =
      typeof input === "string"
        ? input
        : ((input as Request).url ?? String(input));

    if (shouldIgnoreNetworkUrl(url)) {
      return originalFetch(...args);
    }

    const method = init?.method || (input as Request)?.method || "GET";
    const id = genLogId();
    const startedAt = Date.now();

    useLoggerStore.getState().addEntry({
      id,
      kind: "network",
      method,
      url,
      timestamp: startedAt,
      pending: true,
      requestBody: safeStringifyBody(init?.body),
    });

    try {
      const response = await originalFetch(...args);
      const responseBody = await safeParseResponse(response);

      useLoggerStore.getState().updateEntry(id, {
        status: response.status,
        ok: response.ok,
        duration: Date.now() - startedAt,
        responseBody,
        pending: false,
      });

      return response;
    } catch (error) {
      useLoggerStore.getState().updateEntry(id, {
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startedAt,
        pending: false,
      });
      throw error;
    }
  };
};
