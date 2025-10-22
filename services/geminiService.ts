
import { GoogleGenAI } from "@google/genai";

// This is a placeholder for the real API key which should be in process.env.API_KEY
// In this frontend-only example, we'll proceed as if it's available.
const FAKE_API_KEY = "YOUR_API_KEY_HERE";

let ai: GoogleGenAI;
try {
  // We initialize it here to follow the pattern, but the mock function won't use it.
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY || FAKE_API_KEY });
} catch (error) {
  console.warn("Gemini AI SDK initialization failed. Using mock data.", error);
}

const MOCK_RESPONSES: { [key: string]: string[] } = {
  popia: [
    "According to POPIA (Protection of Personal Information Act), an email address is considered personal information as it can be used to identify an individual. (POPIA, Act 4 of 2013, Section 1). Therefore, it must be handled with care.",
    "The Act defines 'personal information' broadly. It includes contact details like email and phone numbers, demographic information, and personal history. Always obtain consent before processing such data. (POPIA, Act 4 of 2013, Section 11).",
    "Under POPIA, you have the right to request access to your personal information held by a company. They are obligated to provide it to you. (POPIA, Act 4 of 2013, Section 23)."
  ],
  rental: [
    "A landlord is generally required to give a tenant 'reasonable notice' before entering the property, except in emergencies. This is typically specified in the lease agreement. (Rental Housing Act 50 of 1999, Section 4).",
    "The termination clause in your lease agreement is crucial. It should outline the notice period required by both parties. Typically, for a month-to-month lease, a full calendar month's notice is standard. I can help you analyze the specific wording if you upload it.",
    "Your security deposit should be held in an interest-bearing account by the landlord. Upon termination of the lease, the landlord must refund the deposit, plus interest, minus any costs for damages beyond normal wear and tear. (Rental Housing Act 50 of 1999, Section 5)."
  ],
  consumer: [
    "The Consumer Protection Act (CPA) gives you the right to return defective goods within six months of purchase for a refund, repair, or replacement. (CPA, Act 68 of 2008, Section 56).",
    "If you received unsolicited goods or services, you are generally not obligated to pay for them. The CPA protects you from such 'negative option marketing'. (CPA, Act 68 of 2008, Section 21).",
    "Contracts must be in plain and understandable language. Any term that is excessively one-sided or unfair may be challenged under the CPA. (CPA, Act 68 of 2008, Section 22)."
  ],
  general: [
    "I can provide general information, but for specific legal advice, it's always best to consult with a qualified legal professional. Would you like me to direct you to the POPIA, Rental, or Consumer Protection agent?",
    "That's an interesting question. To give you the most accurate information, could you tell me if this relates more to consumer rights, rental agreements, or data privacy?",
    "I can help triage your query. Based on what you've asked, it seems related to contract law. The Consumer Protection Agent might be able to assist further."
  ]
};

const getRandomResponse = (agentId: string): string => {
  const responses = MOCK_RESPONSES[agentId] || MOCK_RESPONSES.general;
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Mocks a call to the Gemini API to get a response for a user's query.
 * In a real application, this would use `ai.models.generateContent`.
 */
export const generateResponse = (prompt: string, agentId: string): Promise<string> => {
  console.log(`Mocking Gemini call for agent "${agentId}" with prompt: "${prompt}"`);
  
  // This simulates the async nature of an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const response = getRandomResponse(agentId);
      resolve(response);
    }, 1000 + Math.random() * 1000); // Simulate network latency
  });

  /*
  // EXAMPLE OF A REAL IMPLEMENTATION
  if (!ai) {
     return Promise.reject("Gemini AI SDK not initialized.");
  }
  return ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `SYSTEM PROMPT: You are the ${agentId} AI Agent... \n\n USER: ${prompt}`
  }).then(response => {
      return response.text;
  }).catch(error => {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to communicate with the AI model.");
  });
  */
};
