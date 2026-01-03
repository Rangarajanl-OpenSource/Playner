
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalogyQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateAnalogyQuestions(
  familiar: string,
  complex: string
): Promise<AnalogyQuestion[]> {
  const prompt = `Generate 5 interactive quiz questions for a game called "Playner". 
  The goal is to teach the complex domain: "${complex}" by using analogies to the familiar domain: "${familiar}".
  
  Focus on conceptual mappings (e.g., if comparing NFL to the Stock Market, an "Audible" might be like a "Stop-Loss order").
  Keep the language friendly and suitable for middle-schoolers (10-14).
  
  Each question should have 4 distinct options.
  Include a "Correct Answer", an "Aha!" explanation, and a fun fact.`;

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
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            fact: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation", "fact"]
        }
      }
    }
  });

  try {
    const questions = JSON.parse(response.text || "[]");
    return questions;
  } catch (error) {
    console.error("Failed to parse questions", error);
    return [];
  }
}

export async function editMascotImage(base64Image: string, prompt: string): Promise<string | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png',
          },
        },
        {
          text: `Edit this character mascot image: ${prompt}. Maintain the core character but apply the requested changes.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export async function generateInitialMascot(prompt: string): Promise<string | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A friendly, playful character mascot for a learning app called Playner. Style: 3D render, high quality, soft lighting, vibrant colors. Description: ${prompt}` }]
    },
    config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
