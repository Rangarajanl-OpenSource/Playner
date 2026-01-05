
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalogyQuestion } from "../types";
import { ENABLE_API_CACHE, ENABLE_CLOUD_STORAGE, PRECOMPUTED_STORE, KOALA_GUIDE_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

function getCacheKey(familiar: string, complex: string, goal: string): string {
  const slug = `${familiar}_${complex}_${goal}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return slug;
}

async function fetchFromCloud(key: string): Promise<AnalogyQuestion[] | null> {
  if (!ENABLE_CLOUD_STORAGE) return null;
  await new Promise(r => setTimeout(r, 400));
  if (PRECOMPUTED_STORE[key]) {
    return PRECOMPUTED_STORE[key];
  }
  return null;
}

async function saveToCloud(key: string, data: AnalogyQuestion[]) {
  if (!ENABLE_CLOUD_STORAGE) return;
  console.log(`[Playner Cloud] Syncing: ${key}`);
}

export async function generateAnalogyQuestions(
  familiar: string,
  complex: string,
  goal: string
): Promise<AnalogyQuestion[]> {
  const slug = getCacheKey(familiar, complex, goal);
  const localKey = `playner_q_cache_${slug}`;

  if (ENABLE_API_CACHE) {
    const cached = localStorage.getItem(localKey);
    if (cached) return JSON.parse(cached);
  }

  const cloudData = await fetchFromCloud(slug);
  if (cloudData) {
    if (ENABLE_API_CACHE) localStorage.setItem(localKey, JSON.stringify(cloudData));
    return cloudData;
  }

  const prompt = `Generate 6 interactive quiz questions for "Playner". 
  MISSION: "${goal}". Familiar: "${familiar}". Complex: "${complex}".
  Return JSON with: id, question, familiarConcept, complexConcept, options, correctAnswer, explanation, fact, imagePrompt.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            familiarConcept: { type: Type.STRING },
            complexConcept: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            fact: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation", "fact", "imagePrompt"]
        }
      }
    }
  });

  try {
    const questions = JSON.parse(response.text || "[]");
    if (questions.length > 0) {
      if (ENABLE_API_CACHE) localStorage.setItem(localKey, JSON.stringify(questions));
      await saveToCloud(slug, questions);
    }
    return questions;
  } catch (error) {
    return [];
  }
}

export async function generateConceptImage(prompt: string): Promise<string | null> {
  const imageCacheKey = `playner_img_cache_${btoa(prompt).substring(0, 32)}`;
  if (ENABLE_API_CACHE) {
    const cachedImg = localStorage.getItem(imageCacheKey);
    if (cachedImg) return cachedImg;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A clean, educational illustration. Minimalist vector style. Subject: ${prompt}` }]
    },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const dataUri = `data:image/png;base64,${part.inlineData.data}`;
      if (ENABLE_API_CACHE) {
        try { localStorage.setItem(imageCacheKey, dataUri); } catch (e) {}
      }
      return dataUri;
    }
  }
  return null;
}

export async function getKoalaGuide(): Promise<string | null> {
  const cacheKey = "playner_koala_guide";
  if (ENABLE_API_CACHE) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: KOALA_GUIDE_PROMPT }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const dataUri = `data:image/png;base64,${part.inlineData.data}`;
      if (ENABLE_API_CACHE) localStorage.setItem(cacheKey, dataUri);
      return dataUri;
    }
  }
  return null;
}

export async function editMascotImage(base64Image: string, prompt: string): Promise<string | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/png' } },
        { text: `Edit this character mascot image: ${prompt}.` },
      ],
    },
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
}

export async function generateInitialMascot(prompt: string): Promise<string | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A friendly character mascot for Playner. Style: 3D render. Description: ${prompt}` }]
    },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
}
