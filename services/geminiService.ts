
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalogyQuestion } from "../types";
import { ENABLE_API_CACHE, ENABLE_CLOUD_STORAGE, PRECOMPUTED_STORE, KOALA_GUIDE_PROMPT } from "../constants";

// Fix: Initialize GoogleGenAI with exactly the named parameter pattern required by the guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function getCacheKey(familiar: string, complex: string, goal: string): string {
  // Normalize strings for the slug to increase hit rate
  const f = familiar.toLowerCase().trim().split(' ')[0]; // Use first word (e.g., 'nfl' from 'NFL / Football')
  const c = complex.toLowerCase().trim().split(' ')[0];
  const g = goal.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return `${f}_${c}_${g}`;
}

/**
 * Shuffles an array and returns the shuffled array along with the new index of the previously known item.
 */
function shuffleOptions(options: string[], correctAnswer: string): { shuffled: string[], newCorrect: string } {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { shuffled, newCorrect: correctAnswer };
}

async function fetchFromCloud(key: string): Promise<AnalogyQuestion[] | null> {
  if (!ENABLE_CLOUD_STORAGE) return null;
  
  // If we have a match, return IMMEDIATELY to accelerate loading
  if (PRECOMPUTED_STORE[key]) {
    console.log(`[Playner Cloud] Cache Hit: ${key}`);
    return PRECOMPUTED_STORE[key];
  }
  
  // Simulation delay only for real API fetches or misses
  await new Promise(r => setTimeout(r, 800));
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

  // Check Cloud Store (Precomputed Library)
  const cloudData = await fetchFromCloud(slug);
  if (cloudData) {
    if (ENABLE_API_CACHE) localStorage.setItem(localKey, JSON.stringify(cloudData));
    return cloudData;
  }

  const prompt = `Generate 6 interactive "Bridge Analogy" quiz questions for the app "Playner".
  
  MISSION GOAL: "${goal}"
  FAMILIAR DOMAIN: "${familiar}" (The user knows this well)
  COMPLEX SUBJECT: "${complex}" (The user wants to learn this)

  STRICT CONTENT RULES:
  1. Questions 1-5 MUST be "Bridge Questions". Every bridge question MUST start by describing a specific concept or scenario from the FAMILIAR domain (${familiar}) and then ask how it maps to the COMPLEX subject (${complex}). 
     Example: "In Tic-Tac-Toe, a 'Center Move' controls the board's most valuable real estate. In the Stock Market, what represents the most stable 'real estate' for an investor's portfolio?"
  2. Question 6 is the "Final Challenge". It should be a direct application of the COMPLEX subject to test mastery.
  3. DO NOT generate questions that only mention the complex domain. Use the familiar domain as a mental scaffold for every bridge question.
  
  CORRECT ANSWER RANDOMIZATION:
  - Assign the correct answer to index 0, 1, 2, or 3. 
  - Ensure a perfectly even distribution.

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
    const rawQuestions = JSON.parse(response.text || "[]");
    
    // Manual post-processing shuffle to guarantee 100% distribution across A/B/C/D
    const processedQuestions = rawQuestions.map((q: AnalogyQuestion) => {
      const { shuffled, newCorrect } = shuffleOptions(q.options, q.correctAnswer);
      return { ...q, options: shuffled, correctAnswer: newCorrect };
    });

    if (processedQuestions.length > 0) {
      if (ENABLE_API_CACHE) localStorage.setItem(localKey, JSON.stringify(processedQuestions));
      await saveToCloud(slug, processedQuestions);
    }
    return processedQuestions;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
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
      parts: [{ text: `A clean, educational illustration for a learning app. Subject: ${prompt}` }]
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
