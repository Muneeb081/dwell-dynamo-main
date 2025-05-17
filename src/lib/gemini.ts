
import { chatbotResponses } from './data';
import { generateLocalResponse } from './localChatbot';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

const SYSTEM_PROMPT = `
You are a professional property assistant for a real estate company in Islamabad, Pakistan.
Provide helpful, concise, and accurate information about real estate topics including:
- Property buying and selling processes
- Rental procedures and advice
- Investment opportunities in different areas
- Current property rates in various sectors (F, E, G, I sectors)
- Market trends and forecasts
- Legal requirements for property transactions
- Financing options and mortgage advice

Always be polite, professional, and provide factual information. If you don't know something specific, 
acknowledge it and provide general guidance instead.
Reply should be short and concise. greeting message should be short and accurate.
just answer the user accordingly, don't add extra sentences. professionalism is important.
`;

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("apiKey",apiKey);
    if (!apiKey) {
      console.warn('Gemini API key not found, using fallback responses');
      return generateLocalResponse(userMessage, chatbotResponses);
    }
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: SYSTEM_PROMPT },
              { text: userMessage }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback to local response generation when API fails
    return generateLocalResponse(userMessage, chatbotResponses);
  }
};
