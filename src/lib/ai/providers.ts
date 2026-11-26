import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

export type ProviderId = "gemini" | "groq";
export type ProviderCandidate = {
  id: ProviderId;
  modelId: string;
  model: LanguageModel;
};

export function getProviderCandidates(preferred: "auto" | ProviderId): ProviderCandidate[] {
  const candidates: ProviderCandidate[] = [];
  const order: ProviderId[] = preferred === "auto"
    ? ["gemini", "groq"]
    : [preferred, preferred === "gemini" ? "groq" : "gemini"];

  for (const id of order) {
    if (id === "gemini" && process.env.GEMINI_API_KEY) {
      const modelId = process.env.GEMINI_MODEL || "gemini-3.8-flash";
      const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
      candidates.push({ id, modelId, model: google(modelId) });
    }

    if (id === "groq" && process.env.GROQ_API_KEY) {
      const modelId = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
      const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
      candidates.push({ id, modelId, model: groq(modelId) });
    }
  }

  return candidates;
}
