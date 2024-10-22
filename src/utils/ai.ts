import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { detectTechnologies } from "../lib/network/DetectTechnology";
interface AIPayload {
  payload: string;
  description: string;
}

function waitForResponse(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateAIPayloads(
  apiKey: string,
  fieldName: string,
  isJson: boolean,
  url: string
): Promise<AIPayload[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const software = await detectTechnologies(url);
  const prompt = `Generate multiple NoSQL injection payloads for the field "${fieldName}" in ${
    isJson ? "JSON" : "non-JSON"
  } format related to ${detectTechnologies} applications. Provide the result in a single code block and ensure there are no additional messages or explanations. The response should only include the payloads in JSON format.`;

  try {
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const chat = model.startChat({ safetySettings });
    const result = await chat.sendMessage(prompt);

     await waitForResponse(60000); 

    const responseText = result.response.text();
    console.log("Raw response:", responseText); 
    const codeBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = codeBlockRegex.exec(responseText);

    if (match && match[1]) {
      const cleanedJsonString = match[1].trim();

      let aiPayloads: AIPayload[] = [];

      try {
       const payloads = JSON.parse(cleanedJsonString);

        aiPayloads = Object.entries(payloads).map(([key, value]) => ({
          payload: JSON.stringify({ [key]: value }), 
          description: `AI generated payload for field ${fieldName}`,
        }));
      } catch (jsonError) {
        console.error("Error parsing JSON from payload:", jsonError);
      }

      return aiPayloads;
    } else {
      throw new Error("No valid JSON code block found in the response.");
    }
  } catch (error) {
    console.error("Error generating AI payloads:", error);
    return [];
  }
}
