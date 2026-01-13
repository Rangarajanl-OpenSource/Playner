
import { GoogleGenAI, Type } from "@google/genai";
import { MissionData } from "../types";
import { PRECOMPUTED_STORE } from "../constants";
import { CacheService } from "./cacheService";
import { firebaseService } from "./firebaseService";

const normalizeKey = (familiar: string, complex: string, goal: string) => {
  const norm = (s: string) => 
    s.toLowerCase()
     .trim()
     .replace(/\s+/g, '-')
     .replace(/[^a-z0-9-]/g, '');
  
  return `${norm(familiar)}_${norm(complex)}_${norm(goal)}`;
};

export async function generateMission(familiar: string, complex: string, goal: string): Promise<MissionData> {
  const queryKey = normalizeKey(familiar, complex, goal);
  
  if (PRECOMPUTED_STORE[queryKey]) {
    return PRECOMPUTED_STORE[queryKey];
  }

  const cached = CacheService.get(familiar, complex, goal);
  if (cached) {
    PRECOMPUTED_STORE[queryKey] = cached;
    return cached;
  }

  const cloudData = await firebaseService.getMission(queryKey);
  if (cloudData) {
    CacheService.set(familiar, complex, goal, cloudData);
    PRECOMPUTED_STORE[queryKey] = cloudData;
    return cloudData;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a World-Class Pedagogical Architect. 
  Create a 5-step learning mission that bridges "${familiar}" (familiar) to "${complex}" (complex) 
  specifically for the goal: "${goal}".

  STRICT 5-STEP PEDAGOGY PER MODULE:
  1. PRIME: Activate a known concept from the familiar domain.
  2. BRIDGE: Use a specific analogy to transition from familiar to complex.
  3. INFER: Ask the user to guess a property of the complex concept based on the analogy.
  4. REINFORCE: Solidify the technical reality of the complex concept.
  5. CAPSTONE: A high-level reasoning question combining the analogy and the technical fact.

  Return JSON following the MissionData schema perfectly.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            briefing: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                scenario: { type: Type.STRING },
                objective: { type: Type.STRING }
              },
              required: ["title", "scenario", "objective"]
            },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  conceptName: { type: Type.STRING },
                  bridgeKeywords: {
                    type: Type.OBJECT,
                    properties: {
                      familiar: { type: Type.ARRAY, items: { type: Type.STRING } },
                      complex: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["familiar", "complex"]
                  },
                  prime: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      known_concept: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  },
                  bridge: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  },
                  infer: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  },
                  reinforce: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  },
                  capstone: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  },
                  synthesis: { type: Type.STRING }
                },
                required: ["id", "conceptName", "bridgeKeywords", "prime", "bridge", "infer", "reinforce", "capstone", "synthesis"]
              }
            },
            finalChallenge: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          },
          required: ["briefing", "modules", "finalChallenge"]
        }
      }
    });

    const missionData = JSON.parse(response.text || "{}");
    CacheService.set(familiar, complex, goal, missionData);
    PRECOMPUTED_STORE[queryKey] = missionData;
    await firebaseService.saveMission(queryKey, missionData);
    
    return missionData;
  } catch (error) {
    console.error("AI Generation Failed:", error);
    throw error;
  }
}
