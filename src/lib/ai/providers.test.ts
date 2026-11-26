import { afterEach, describe, expect, it } from "vitest";
import { getProviderCandidates } from "./providers";

const original = {
  gemini: process.env.GEMINI_API_KEY,
  groq: process.env.GROQ_API_KEY,
  geminiModel: process.env.GEMINI_MODEL,
  groqModel: process.env.GROQ_MODEL
};

afterEach(() => {
  if (original.gemini === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = original.gemini;
  if (original.groq === undefined) delete process.env.GROQ_API_KEY;
  else process.env.GROQ_API_KEY = original.groq;
  if (original.geminiModel === undefined) delete process.env.GEMINI_MODEL;
  else process.env.GEMINI_MODEL = original.geminiModel;
  if (original.groqModel === undefined) delete process.env.GROQ_MODEL;
  else process.env.GROQ_MODEL = original.groqModel;
});

describe("provider routing", () => {
  it("orders Gemini before Groq in automatic mode and respects model overrides", () => {
    process.env.GEMINI_API_KEY = "gemini-test-key";
    process.env.GROQ_API_KEY = "groq-test-key";
    process.env.GEMINI_MODEL = "gemini-test-model";
    process.env.GROQ_MODEL = "groq-test-model";

    expect(getProviderCandidates("auto").map(({ id, modelId }) => ({ id, modelId }))).toEqual([
      { id: "gemini", modelId: "gemini-test-model" },
      { id: "groq", modelId: "groq-test-model" }
    ]);
  });

  it("uses the requested provider first and omits providers without credentials", () => {
    delete process.env.GEMINI_API_KEY;
    process.env.GROQ_API_KEY = "groq-test-key";

    expect(getProviderCandidates("gemini").map(({ id }) => id)).toEqual(["groq"]);
  });
});
