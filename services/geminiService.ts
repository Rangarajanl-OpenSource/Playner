
import { GoogleGenAI, Type } from "@google/genai";
import { MissionData } from "../types";
import { PRECOMPUTED_STORE } from "../constants";
import { CacheService } from "./cacheService";

export const normalizeKey = (familiar: string, complex: string, goal: string) => {
  const norm = (s: string) => 
    s.toLowerCase()
     .trim()
     .replace(/\s+/g, '-')
     .replace(/[^a-z0-9-]/g, '');
  
  return `${norm(familiar)}_${norm(complex)}_${norm(goal)}`;
};

function shuffleOptions(step: any) {
  const options = [...step.options];
  const correct = step.correctAnswer;
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { ...step, options };
}

export async function generateMission(familiar: string, complex: string, goal: string): Promise<MissionData> {
  const queryKey = normalizeKey(familiar, complex, goal);
  
  // These checks are now redundant with the optimization in App.tsx but kept for safety
  if (PRECOMPUTED_STORE[queryKey]) return PRECOMPUTED_STORE[queryKey];
  const cached = CacheService.get(familiar, complex, goal);
  if (cached) return cached;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a Pedagogical Architect. Create a 5-step mission bridging "${familiar}" to "${complex}" for the goal: "${goal}".
  
  RULES FOR CONTENTION:
  1. DISTRACTORS: Must be technically related to the topic (e.g., if the answer is "Decision Tree", distractors should be "Random Forest" or "Linear Regression"). 
  2. DISTRIBUTION: Vary the correct answer position across A, B, C, D randomly.
  3. MASCOT TIPS: Every step needs a "tip" for a fox mascot (encouraging, witty).

  JSON structure must follow MissionData schema.`;

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
              properties: { title: { type: Type.STRING }, scenario: { type: Type.STRING }, objective: { type: Type.STRING } },
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
                    properties: { familiar: { type: Type.ARRAY, items: { type: Type.STRING } }, complex: { type: Type.ARRAY, items: { type: Type.STRING } } },
                    required: ["familiar", "complex"]
                  },
                  prime: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING }, tip: { type: Type.STRING } }, required: ["question", "options", "correctAnswer", "explanation", "tip"] },
                  bridge: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING }, tip: { type: Type.STRING } }, required: ["question", "options", "correctAnswer", "explanation", "tip"] },
                  infer: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING }, tip: { type: Type.STRING } }, required: ["question", "options", "correctAnswer", "explanation", "tip"] },
                  reinforce: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING }, tip: { type: Type.STRING } }, required: ["question", "options", "correctAnswer", "explanation", "tip"] },
                  capstone: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING }, tip: { type: Type.STRING } }, required: ["question", "options", "correctAnswer", "explanation", "tip"] },
                  synthesis: { type: Type.STRING }
                },
                required: ["id", "conceptName", "bridgeKeywords", "prime", "bridge", "infer", "reinforce", "capstone", "synthesis"]
              }
            },
            finalChallenge: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING }, tip: { type: Type.STRING } }, required: ["question", "options", "correctAnswer", "explanation", "tip"] }
          },
          required: ["briefing", "modules", "finalChallenge"]
        }
      }
    });

    const missionData: MissionData = JSON.parse(response.text || "{}");
    
    missionData.modules = missionData.modules.map(m => ({
      ...m,
      prime: shuffleOptions(m.prime),
      bridge: shuffleOptions(m.bridge),
      infer: shuffleOptions(m.infer),
      reinforce: shuffleOptions(m.reinforce),
      capstone: shuffleOptions(m.capstone)
    }));
    missionData.finalChallenge = shuffleOptions(missionData.finalChallenge);

    CacheService.set(familiar, complex, goal, missionData);
    return missionData;
  } catch (error) {
    throw error;
  }
}
