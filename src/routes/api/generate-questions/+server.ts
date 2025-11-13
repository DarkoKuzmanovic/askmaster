import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, CUSTOM_API_KEY, CUSTOM_MODEL, CUSTOM_BASE_URL } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";

const GOOGLE_MODEL = "gemini-2.5-pro";

type Provider = "google" | "custom";

const SYSTEM_INSTRUCTIONS =
  "You are AskMaster, an assistant that only returns valid JSON arrays of multiple-choice questions. Respond with nothing except the JSON array requested.";

const buildPrompt = (topic: string, questionCount: number, temperature: number) =>
  `Generate a JSON array of ${questionCount} multiple-choice questions about ${topic}. Each question should be an object with the following keys: "question", "answers" (an array of 4 strings), and "correctAnswerIndex" (the index of the correct answer in the "answers" array). The output must be a valid JSON array. Creativity level: ${temperature}.`;

const extractQuestions = (rawText: string) => {
  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  const jsonString = jsonMatch ? jsonMatch[0] : rawText;
  try {
    return JSON.parse(jsonString);
  } catch (parseError) {
    throw new Error("Failed to parse AI response as JSON.");
  }
};

const ensureGoogleKey = () => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
    throw new Error("Gemini API key is missing or empty");
  }
};

const ensureCustomConfig = () => {
  if (!CUSTOM_API_KEY || CUSTOM_API_KEY === "") {
    throw new Error("Custom API key is missing or empty");
  }
  if (!CUSTOM_MODEL || CUSTOM_MODEL === "") {
    throw new Error("Custom model is missing or empty");
  }
  if (!CUSTOM_BASE_URL || CUSTOM_BASE_URL === "") {
    throw new Error("Custom base URL is missing or empty");
  }
};

const parseSseAwareJson = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Custom API response was empty.");
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    const payload = trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.replace(/^data:\s*/, ""))
      .filter((line) => line && line !== "[DONE]")
      .pop();

    if (payload) {
      return JSON.parse(payload);
    }

    throw new Error("Custom API returned an unreadable response.");
  }
};

const generateWithGoogle = async (prompt: string) => {
  ensureGoogleKey();
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: GOOGLE_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const normalizeContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((chunk) => {
        if (typeof chunk === "string") return chunk;
        if (typeof chunk === "object" && chunk !== null) {
          const candidate = chunk as { text?: unknown; content?: unknown };
          if (typeof candidate.text === "string") {
            return candidate.text;
          }
          if (typeof candidate.content === "string") {
            return candidate.content;
          }
        }
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  return "";
};

const generateWithCustom = async (prompt: string, temperature: number) => {
  ensureCustomConfig();
  const response = await fetch(`${CUSTOM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CUSTOM_API_KEY}`,
    },
    body: JSON.stringify({
      model: CUSTOM_MODEL,
      temperature,
      stream: false,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTIONS },
        { role: "user", content: prompt },
      ],
    }),
  });

  const rawBody = await response.text();
  let data: any;

  try {
    data = parseSseAwareJson(rawBody);
  } catch (parseError) {
    const baseMessage = parseError instanceof Error ? parseError.message : "Custom API returned invalid response.";
    throw new Error(baseMessage);
  }

  if (!response.ok) {
    const detail = data?.error?.message ?? data?.error ?? response.statusText;
    throw new Error(`Custom API error: ${detail}`);
  }

  const choice = data?.choices?.[0];
  if (!choice) {
    throw new Error("Custom API did not return any choices.");
  }

  const messageContent = choice.message?.content ?? choice.text ?? "";
  const content = normalizeContent(messageContent);
  if (!content) {
    throw new Error("Custom API response was empty.");
  }

  return content;
};

export const POST: RequestHandler = async ({ request }) => {
  let topic = "";
  let questionCount = 5;
  let temperature = 0.7;
  let provider: Provider = "google";

  try {
    const body = await request.json();
    topic = body.topic;
    questionCount = Number(body.questionCount) || questionCount;
    temperature = typeof body.temperature === "number" ? body.temperature : temperature;
    provider = body.provider === "custom" ? "custom" : "google";

    if (!topic || !questionCount) {
      return json({ error: "Topic and question count are required." }, { status: 400 });
    }

    const prompt = buildPrompt(topic, questionCount, temperature);
    const rawText =
      provider === "custom" ? await generateWithCustom(prompt, temperature) : await generateWithGoogle(prompt);
    const questions = extractQuestions(rawText);

    return json(questions);
  } catch (error) {
    console.error("Error generating questions:", error);

    // Return user-friendly error messages instead of mock data
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    // Check for common API error patterns
    if (errorMessage.includes("403") || errorMessage.includes("forbidden") || errorMessage.includes("overloaded")) {
      return json(
        {
          error: "The AI provider is currently overloaded. Please try again in a moment.",
          details: "Service temporarily unavailable",
        },
        { status: 503 }
      );
    } else if (errorMessage.includes("429") || errorMessage.includes("rate limit") || errorMessage.includes("quota")) {
      return json(
        {
          error: "Rate limit exceeded. Please try again in a moment.",
          details: "Too many requests to the AI service",
        },
        { status: 429 }
      );
    } else if (errorMessage.includes("JSON") || errorMessage.includes("parse")) {
      return json(
        {
          error: "Failed to process AI response. The service returned invalid data.",
          details: "Please try again",
        },
        { status: 500 }
      );
    } else if (error instanceof ReferenceError) {
      return json(
        {
          error: "Server configuration error: Missing variable.",
          details: "Please check server configuration",
        },
        { status: 500 }
      );
    } else {
      return json(
        {
          error: "An unexpected error occurred while generating questions.",
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  }
};
