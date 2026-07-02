import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MERGE_GATEWAY_URL = "https://api-gateway.merge.dev/v1/responses";
const MODEL = "anthropic/claude-sonnet-4-6";

interface GenerateRequestBody {
  prompt: string;
  count: number;
}

function extractText(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;

  if (typeof obj.output_text === "string") return obj.output_text;

  if (Array.isArray(obj.output)) {
    const parts: string[] = [];
    for (const item of obj.output) {
      if (item && typeof item === "object" && Array.isArray((item as Record<string, unknown>).content)) {
        for (const c of (item as Record<string, unknown>).content as unknown[]) {
          if (c && typeof c === "object") {
            const text = (c as Record<string, unknown>).text;
            if (typeof text === "string") parts.push(text);
          }
        }
      }
    }
    if (parts.length) return parts.join("\n");
  }

  const choices = obj.choices;
  if (Array.isArray(choices) && choices[0]) {
    const message = (choices[0] as Record<string, unknown>).message;
    if (message && typeof message === "object") {
      const content = (message as Record<string, unknown>).content;
      if (typeof content === "string") return content;
    }
  }

  return null;
}

function parseJsonArray(text: string): string[] | null {
  const trimmed = text.trim();
  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    const parsed = JSON.parse(trimmed.slice(start, end + 1));
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return null;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.MERGE_GATEWAY_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ items: null, error: "MERGE_GATEWAY_API_KEY not configured" }, { status: 200 });
  }

  let body: GenerateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ items: null, error: "Invalid request body" }, { status: 400 });
  }

  if (!body.prompt) {
    return NextResponse.json({ items: null, error: "Missing prompt" }, { status: 400 });
  }

  try {
    const response = await fetch(MERGE_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: [
          {
            type: "message",
            role: "user",
            content: body.prompt,
          },
        ],
        stream: false,
        include_routing_metadata: false,
        model: MODEL,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ items: null, error: `Merge Gateway error: ${errText}` }, { status: 200 });
    }

    const data = await response.json();
    const text = extractText(data);
    const items = text ? parseJsonArray(text) : null;

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { items: null, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 200 },
    );
  }
}
