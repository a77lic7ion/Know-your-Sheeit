
import { GoogleGenAI, Type } from "@google/genai";

// The API key is expected to be available in the environment variables.
let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI. Make sure API_KEY is set in the environment.", error);
}

const KNOWLEDGE_BASE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'A concise summary of the document\'s purpose and key contents.'
    },
    key_concepts: {
      type: Type.ARRAY,
      description: 'A list of important legal terms or concepts found in the document.',
      items: { type: Type.STRING }
    },
    relevant_clauses: {
      type: Type.ARRAY,
      description: 'An array of objects, each representing a significant clause or section.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'The title or heading of the clause.'
          },
          text: {
            type: Type.STRING,
            description: 'The full text of the clause.'
          }
        },
        required: ['title', 'text']
      }
    }
  },
  required: ['summary', 'key_concepts', 'relevant_clauses']
};

/**
 * Processes a URL to extract legal information and structure it for a knowledge base.
 * This simulates RAG by asking the model to act as if it has fetched the URL content.
 */
export const processUrlForRAG = async (url: string): Promise<object> => {
  if (!ai) {
    throw new Error("Gemini AI SDK not initialized. Is the API_KEY configured?");
  }
  console.log(`Processing URL for RAG: ${url}`);
  
  const prompt = `You are an AI assistant that structures web content for a legal knowledge base. A user has submitted this URL: ${url}.

  Your task is to:
  1. Act as if you have fetched and read the content from this URL.
  2. Analyze its content for legal information.
  3. Extract key concepts, summarize the main points, and identify significant clauses.
  4. Present this information as a structured JSON object that matches the provided schema.

  If the URL seems invalid or you cannot hypothetically access it, create a plausible example of a knowledge base entry based on what the URL *should* contain. For example, if the URL is 'gov.za/acts/rental-housing-act', generate a summary of that act.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: KNOWLEDGE_BASE_SCHEMA
      }
    });

    const jsonText = response.text;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini API Error during URL processing:", error);
    throw new Error("Failed to process the URL with the AI model.");
  }
};

/**
 * Calls the Gemini API to get a response for a user's query.
 */
export const generateResponse = async (prompt: string, agentId: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini AI SDK not initialized. Is the API_KEY configured?");
  }
  console.log(`Calling Gemini for agent "${agentId}" with prompt: "${prompt}"`);

  const systemPrompts: { [key: string]: string } = {
    popia: "You are an expert AI legal assistant specializing in South Africa's Protection of Personal Information Act (POPIA). Provide clear, accurate, and concise answers based on the act. Reference specific sections where possible.",
    rental: "You are an expert AI legal assistant specializing in South Africa's rental housing law, including the Rental Housing Act. Provide clear, practical advice for tenants and landlords. Reference specific sections of the act where relevant.",
    consumer: "You are an expert AI legal assistant specializing in South Africa's Consumer Protection Act (CPA). Help users understand their rights and obligations as consumers. Reference specific sections of the act when applicable.",
    general: "You are a general AI legal assistant for South African law. Your role is to provide high-level information and direct users to the appropriate specialized agent (POPIA, Rental Law, Consumer Protection) if their query falls into one of those categories."
  };
  
  const systemInstruction = systemPrompts[agentId] || systemPrompts.general;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

/**
 * Uses Gemini to reformat a conversation log into a specific format (letter or email).
 */
export const formatConversationForExport = async (conversationLog: string, format: 'letter' | 'email', agentName: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini AI SDK not initialized. Is the API_KEY configured?");
  }
  
  let prompt = '';
  if (format === 'letter') {
    prompt = `You are an AI legal assistant. A user wants to draft a formal letter based on their conversation with the ${agentName}.
    
    Here is the conversation log:
    ---
    ${conversationLog}
    ---
    
    Please reformat this conversation into a clear, professional, and formal letter. The letter should summarize the key legal points discussed and the advice given. Use appropriate letter formatting (e.g., recipient address placeholder, date, salutation, body paragraphs, closing).`;
  } else { // email
    prompt = `You are an AI legal assistant. A user wants to compose a professional email based on their conversation with the ${agentName}.
    
    Here is the conversation log:
    ---
    ${conversationLog}
    ---
    
    Please reformat this conversation into a clear and professional email. The email should summarize the key legal points and advice. Use appropriate email formatting (e.g., Subject line, Salutation, Body, Closing).`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error during export formatting:", error);
    throw new Error("Failed to reformat conversation with the AI model.");
  }
};
