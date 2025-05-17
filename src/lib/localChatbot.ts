
import { ChatbotResponses } from './types';

export const generateLocalResponse = (query: string, chatbotResponses: ChatbotResponses): string => {
  // Convert query to lowercase for easier matching
  const lowercaseQuery = query.toLowerCase();
  
  // Check for property buying related queries
  if (lowercaseQuery.includes('buy') || lowercaseQuery.includes('buying') || lowercaseQuery.includes('purchase')) {
    if (lowercaseQuery.includes('process') || lowercaseQuery.includes('how to')) {
      return chatbotResponses.buying.process;
    } else if (lowercaseQuery.includes('tips') || lowercaseQuery.includes('check') || lowercaseQuery.includes('verify')) {
      return chatbotResponses.buying.tips;
    } else if (lowercaseQuery.includes('finance') || lowercaseQuery.includes('loan') || lowercaseQuery.includes('mortgage')) {
      return chatbotResponses.buying.finance;
    } 
    // ... more buying-related conditions
  }
  
  // Check for property renting related queries
  if (lowercaseQuery.includes('rent') || lowercaseQuery.includes('renting') || lowercaseQuery.includes('lease')) {
    if (lowercaseQuery.includes('process') || lowercaseQuery.includes('how to')) {
      return chatbotResponses.renting.process;
    } else if (lowercaseQuery.includes('tips') || lowercaseQuery.includes('advice')) {
      return chatbotResponses.renting.tips;
    } else if (lowercaseQuery.includes('document') || lowercaseQuery.includes('paper')) {
      return chatbotResponses.renting.documents;
    }
    // ... more renting-related conditions
  }
  
  // Check for investment related queries
  if (lowercaseQuery.includes('invest') || lowercaseQuery.includes('return') || lowercaseQuery.includes('profit')) {
    if (lowercaseQuery.includes('advice') || lowercaseQuery.includes('should')) {
      return chatbotResponses.investment.advice;
    } else if (lowercaseQuery.includes('return') || lowercaseQuery.includes('profit') || lowercaseQuery.includes('yield')) {
      return chatbotResponses.investment.returns;
    } else if (lowercaseQuery.includes('hotspot') || lowercaseQuery.includes('area') || lowercaseQuery.includes('location')) {
      return chatbotResponses.investment.hotspots;
    }
    // ... more investment-related conditions
  }
  
  // Check for rate related queries
  if (lowercaseQuery.includes('rate') || lowercaseQuery.includes('price') || lowercaseQuery.includes('cost')) {
    if (lowercaseQuery.includes('f-') || lowercaseQuery.includes('f sector')) {
      return chatbotResponses.rates["F-Sectors"];
    } else if (lowercaseQuery.includes('e-') || lowercaseQuery.includes('e sector')) {
      return chatbotResponses.rates["E-Sectors"];
    } else if (lowercaseQuery.includes('bahria')) {
      return chatbotResponses.rates["Bahria Town"];
    } else if (lowercaseQuery.includes('dha')) {
      return chatbotResponses.rates["DHA"];
    }
    // ... more rate-related conditions
  }
  
  // Default response
  return "I'm not sure about that. Could you try asking about buying, renting, investment advice, or property rates in Islamabad? You can also ask about current market trends or specific areas.";
};
