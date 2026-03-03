import { GoogleGenAI } from "@google/genai";

export async function generateCabinCrewGroupImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A professional hero image of a diverse flight attendant team smiling and standing confidently. Include both male and female crew members in sharp, professional airline attire. They should be posed in a way that suggests teamwork and premium service. High-resolution, cinematic lighting, with a clean and airy aviation-related background.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates![0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
