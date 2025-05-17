
import { ChatbotResponses, SuggestedQuery } from "./types";
import { AuthUser } from "@/types/auth";
import { logger } from "./logger";
import { registerNewUser } from "./api";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    area: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number; // in sq. ft.
    furnished: boolean;
    parking: boolean;
  };
  images: string[];
  type: "house" | "apartment" | "commercial" | "plot";
  status: "sale" | "rent";
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
  try {
    const token = localStorage.getItem("authToken")
    const response = await fetch(`${API_URL}/api/properties/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add token if needed
         'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const property: Property = await response.json();
    return property;
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return undefined;
  }
};

export const getPropertiesByType = async (
  type = 'all',
  status = 'all',
  minPrice:any,
  maxPrice:any
) => {
  
  try {
    // Build the query string dynamically
    let query = '?';

    if (type && type !== 'all') {
      query += `type=${type}&`;
    }

    if (status && status !== 'all') {
      query += `status=${status}&`;
    }

    if (minPrice !== undefined) {
      query += `minPrice=${minPrice}&`;
    }

    if (maxPrice !== undefined) {
      query += `maxPrice=${maxPrice}&`;
    }

    // Remove the trailing '&' if it exists
    query = query.endsWith('&') ? query.slice(0, -1) : query;

    // Make the fetch call
    const response = await fetch(`${API_URL}/api/properties${query}`);
    
    // Check if the response is OK (status code 200)
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    // Parse the response JSON
    const properties = await response.json();
    // Return the filtered properties
    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

 const API_URL ="http://localhost:5000"
export const getProperty = async () => {
  try {
    const res = await fetch(`${API_URL}/api/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

export const addProperty = async (
  propertyData: Omit<Property, "id" | "createdAt">
) => {
  try {
  const token = localStorage.getItem("authToken")
   const res = await fetch(`${API_URL}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' ,
    'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(propertyData),
  });

    const data = await res.json(); // Now safe to call
    return{
       success: true,
       propertyId : data.property._id,
      message: "Failed to add property",
    }
  } catch (error) {
    console.error("Error adding property:", error);
    return {
      success: false,
      message: "Failed to add property",
    };
  }
};
export const updatePropertyStatus = async (propertyId:string, newStatus:any) => {
  try {
    const response = await fetch(`${API_URL}/api/properties/${propertyId}/status`, {
      method: 'PUT', // HTTP method
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Optional: If you are using JWT or session-based authentication
      },
      body: JSON.stringify({
       newStatus, // status should be 'sale' or 'rent'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update property status');
    }

    const data = await response.json();
    console.log('Property status updated:', data.property);
    return data;  // You can use this data to update the UI if necessary
  } catch (error) {
    console.error('Error updating property status:', error);
  }
};
export const updateProperty = async (
  id: string,
  propertyData: Partial<Property>
): Promise<{ success: boolean; message: string }> => {
  try {
    // Assuming `API_URL` is the URL of your API endpoint
    const response = await fetch(`${API_URL}/api/properties/${id}`, {
      method: 'PUT', // Use PUT to update
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: 'Property updated successfully',
      };
    } else {
      return {
        success: false,
        message: result.message || 'Failed to update property',
      };
    }
  } catch (error) {
    console.error('Error updating property:', error);
    return {
      success: false,
      message: 'Failed to update property',
    };
  }
};
export const deleteProperty = async (id:string) => {
  const token = localStorage.getItem('authToken')
  try {
    const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
  return{
    success: true,
    Message: data.message
  }
  } catch (error) {
    return{
      success: false,
      Message: error
    }
   
  }
};
export const getUserProperties = async (userId: string): Promise<Property[]> => {
  try {
     const token = localStorage.getItem("authToken")
    // Assuming `API_URL` is the base URL of your API endpoint
    const response = await fetch(`${API_URL}/api/properties/user/${userId}`, {
      method: 'GET', // Fetch data
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Assuming the API returns an array of properties in the response body
    const properties: Property[] = await response.json();

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return []; // Return an empty array if the fetch fails
  }
};

export const getMessages = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/messages/conversation/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Pass your token here
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();

    // Optional: sort messages by createdAt (latest first)
    return data.sort(
        (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const sendMessage = async ({
                                    senderId,
                                    receiverId,
                                    content,
                                    propertyId,
                                    propertyTitle,
                                  }: {
  senderId: string;
  receiverId: string;
  content: string;
  propertyId?: string;
  propertyTitle?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/api/messages/m`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        senderId,
        receiverId,
        content,
        propertyId,
        propertyTitle,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      message: 'Failed to send message',
    };
  }
}

export const markAsRead = async (senderId:string,receiverId :string) => {
  try {
    const res = await fetch(`${API_URL}/api/messages/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ senderId,receiverId }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (error:any) {
    console.error('Failed to mark messages as read:', error);
    return { success: false, message: error.message };
  }
};
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
  content: string;
  createdAt: string;
  read: boolean;
  propertyId?: string;
  propertyTitle?: string;
}

export async function addFavorite(propertyId: string,) {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    },
    body: JSON.stringify({ propertyId}),
  });


    const data = await res.json();

 return { success: res.ok, data, message: data.message || '' };
}
export async function getFavorite() {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  });
  return res.json();
}
export async function removeFavorite(propertyId: string) {
  const res = await fetch(`${API_URL}/api/favorites/${propertyId}`, {
    method:"DELETE",
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  });
      const data = await res.json();

 return { success: res.ok, data, message: data.message || '' };

}

export async function checkFavorite(propertyId: string,) {
  const res = await fetch(`${API_URL}/api/favorites/check/${propertyId}`,{
    method:"GET",
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  });
  return res.json();
}

export async function toggleFavoriteDB(propertyId: string): Promise<'added' | 'removed'> {
  try {
    // Check if the property is already favorited by the user
    const { isFavorite } = await checkFavorite(propertyId);

    if (isFavorite) {
      // If it is already favorited, remove it
      await removeFavorite(propertyId);
      return 'removed';
    } else {
      // If not favorited, add to favorites
      await addFavorite(propertyId);
      return 'added';
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

export const chatbotResponses: ChatbotResponses = {
  buying: {
    process: `Here's the process of buying a property in Islamabad:

1. Property Search:
   - Browse listings on our platform
   - Filter by location, price, and property type
   - Schedule viewings with property agents

2. Document Verification:
   - Verify property ownership documents
   - Check for any encumbrances or legal issues
   - Verify property tax records

3. Financial Planning:
   - Calculate total cost including registration fees
   - Arrange financing if needed
   - Plan for down payment and installments

4. Negotiation:
   - Discuss price with the seller
   - Negotiate terms and conditions
   - Agree on payment schedule

5. Legal Process:
   - Hire a property lawyer
   - Draft and review sale agreement
   - Complete property registration
   - Transfer ownership

6. Final Steps:
   - Complete payment as per agreement
   - Obtain possession of property
   - Update utility connections
   - Register for property tax

Would you like more specific information about any of these steps?`,

    tips: `Here are important tips for buying property in Islamabad:

1. Document Verification:
   - Always verify property ownership documents
   - Check for any pending dues or legal issues
   - Verify property dimensions and boundaries
   - Ensure all required permissions are in place

2. Location Assessment:
   - Research the area's development plans
   - Check proximity to essential facilities
   - Consider future development potential
   - Verify accessibility and infrastructure

3. Financial Considerations:
   - Compare prices in similar areas
   - Factor in all additional costs
   - Consider property tax implications
   - Plan for maintenance costs

4. Legal Protection:
   - Hire a reputable property lawyer
   - Get all agreements in writing
   - Keep records of all transactions
   - Verify seller's identity and ownership

5. Property Inspection:
   - Check property condition thoroughly
   - Verify all amenities and features
   - Look for potential maintenance issues
   - Consider professional inspection

Would you like more specific advice about any of these aspects?`,

    finance: `Here's information about property financing in Islamabad:

1. Available Options:
   - Bank mortgages
   - Housing finance companies
   - Personal loans
   - Installment plans from developers

2. Requirements:
   - Valid CNIC
   - Proof of income
   - Bank statements
   - Property documents
   - Down payment (usually 20-30%)

3. Process:
   - Compare different lenders
   - Check interest rates
   - Calculate monthly payments
   - Submit application
   - Property valuation
   - Loan approval and disbursement

4. Important Considerations:
   - Interest rates and terms
   - Processing fees
   - Early payment penalties
   - Insurance requirements
   - Property valuation costs

Would you like specific information about any financing option?`,
  },
  renting: {
    process: `Here's the process of renting a property in Islamabad:

1. Property Search:
   - Browse rental listings
   - Filter by location and budget
   - Schedule property viewings

2. Document Preparation:
   - CNIC copy
   - Recent salary slips
   - Bank statements
   - Previous landlord reference
   - Employment letter

3. Agreement:
   - Review lease terms
   - Discuss maintenance responsibilities
   - Agree on security deposit
   - Sign rental agreement
   - Pay security deposit and first month's rent

4. Move-in:
   - Property inspection
   - Document handover
   - Utility connections
   - Key handover

Would you like more details about any of these steps?`,

    tips: `Here are important tips for renting in Islamabad:

1. Before Renting:
   - Research the area thoroughly
   - Check property condition
   - Verify landlord's identity
   - Review all documents carefully

2. Financial Planning:
   - Budget for security deposit
   - Plan for monthly rent
   - Consider utility costs
   - Factor in maintenance expenses

3. Legal Protection:
   - Get everything in writing
   - Keep records of payments
   - Document property condition
   - Understand your rights

4. Property Assessment:
   - Check water pressure
   - Verify electricity supply
   - Test all appliances
   - Look for maintenance issues

Would you like more specific advice about any of these aspects?`,

    documents: `Here are the essential documents needed for renting:

1. Personal Documents:
   - CNIC copy
   - Recent photographs
   - Previous landlord reference
   - Employment letter
   - Bank statements

2. Financial Documents:
   - Salary slips
   - Bank account details
   - Tax returns (if applicable)
   - Proof of income

3. Property Documents:
   - Property ownership proof
   - Property tax receipts
   - Utility bills
   - Maintenance records

4. Legal Documents:
   - Rental agreement
   - Security deposit receipt
   - Property condition report
   - Inventory list

Would you like more information about any of these documents?`,
  },
  investment: {
    advice: `Here's investment advice for Islamabad property:

1. Market Analysis:
   - Study current market trends
   - Analyze price movements
   - Consider future developments
   - Evaluate rental yields

2. Location Selection:
   - Focus on developed areas
   - Consider upcoming projects
   - Check infrastructure plans
   - Evaluate accessibility

3. Property Type:
   - Choose based on demand
   - Consider maintenance costs
   - Evaluate rental potential
   - Think about resale value

4. Financial Planning:
   - Calculate ROI
   - Consider holding period
   - Plan for maintenance
   - Factor in taxes

Would you like specific advice about any investment aspect?`,

    returns: `Here's information about property investment returns:

1. Rental Yields:
   - Average 5-8% annually
   - Higher in prime locations
   - Varies by property type
   - Depends on maintenance

2. Capital Appreciation:
   - Historical trends
   - Future projections
   - Area-specific growth
   - Development impact

3. Additional Income:
   - Parking rentals
   - Commercial use
   - Short-term rentals
   - Property services

4. Cost Considerations:
   - Maintenance costs
   - Property taxes
   - Insurance
   - Management fees

Would you like specific information about returns in any area?`,

    hotspots: `Here are the current investment hotspots in Islamabad:

1. Prime Locations:
   - F-7, F-8
   - E-11
   - DHA Phase 2
   - Bahria Town

2. Upcoming Areas:
   - CDA sectors
   - New housing schemes
   - Development zones
   - Commercial areas

3. Growth Factors:
   - Infrastructure development
   - Commercial projects
   - Educational institutions
   - Healthcare facilities

4. Investment Potential:
   - Price appreciation
   - Rental demand
   - Development plans
   - Market stability

Would you like specific information about any of these areas?`,
  },
  rates: {
    "F-Sectors": `Current property rates in F-Sectors:

1. F-7:
   - Plots: 25-35 crore
   - Houses: 30-50 crore
   - Apartments: 8-15 crore

2. F-8:
   - Plots: 20-30 crore
   - Houses: 25-40 crore
   - Apartments: 6-12 crore

3. F-6:
   - Plots: 30-40 crore
   - Houses: 35-55 crore
   - Apartments: 10-18 crore

Note: Rates vary based on:
- Plot size
- Location within sector
- Property condition
- Amenities available

Would you like specific rates for any property type?`,

    "E-Sectors": `Current property rates in E-Sectors:

1. E-11:
   - Plots: 15-25 crore
   - Houses: 20-35 crore
   - Apartments: 5-10 crore

2. E-7:
   - Plots: 12-20 crore
   - Houses: 15-30 crore
   - Apartments: 4-8 crore

3. E-8:
   - Plots: 10-18 crore
   - Houses: 12-25 crore
   - Apartments: 3-7 crore

Note: Rates vary based on:
- Plot size
- Location within sector
- Property condition
- Amenities available

Would you like specific rates for any property type?`,

    "Bahria Town": `Current property rates in Bahria Town:

1. Residential Plots:
   - 5 Marla: 1.5-2 crore
   - 10 Marla: 2.5-3.5 crore
   - 1 Kanal: 4-6 crore

2. Houses:
   - 5 Marla: 2-3 crore
   - 10 Marla: 3.5-5 crore
   - 1 Kanal: 6-9 crore

3. Apartments:
   - 1 Bed: 1-1.5 crore
   - 2 Bed: 1.5-2.5 crore
   - 3 Bed: 2.5-4 crore

Note: Rates vary based on:
- Phase number
- Location within phase
- Property condition
- Amenities available

Would you like specific rates for any property type?`,

    DHA: `Current property rates in DHA:

1. Residential Plots:
   - 5 Marla: 2-3 crore
   - 10 Marla: 3.5-5 crore
   - 1 Kanal: 6-9 crore

2. Houses:
   - 5 Marla: 2.5-4 crore
   - 10 Marla: 4-6 crore
   - 1 Kanal: 7-11 crore

3. Apartments:
   - 1 Bed: 1.5-2.5 crore
   - 2 Bed: 2.5-4 crore
   - 3 Bed: 3.5-6 crore

Note: Rates vary based on:
- Phase number
- Location within phase
- Property condition
- Amenities available

Would you like specific rates for any property type?`,
  },
  trends: {
    current: `Current market trends in Islamabad:

1. Price Trends:
   - Stable prices in prime locations
   - Moderate growth in new areas
   - Increased demand for apartments
   - Rising commercial property rates

2. Demand Patterns:
   - High demand in F-Sectors
   - Growing interest in E-Sectors
   - Increasing apartment demand
   - Strong commercial property demand

3. Development Projects:
   - New housing schemes
   - Infrastructure improvements
   - Commercial developments
   - Educational institutions

4. Investment Opportunities:
   - Residential plots
   - Commercial properties
   - Rental properties
   - Development projects

Would you like specific information about any trend?`,

    future: `Future market projections for Islamabad:

1. Expected Developments:
   - New housing schemes
   - Metro bus expansion
   - Commercial zones
   - Educational hubs

2. Price Projections:
   - Moderate growth in prime areas
   - Higher growth in new sectors
   - Rising apartment prices
   - Increasing commercial rates

3. Investment Potential:
   - Residential properties
   - Commercial spaces
   - Rental market
   - Development projects

4. Market Factors:
   - Population growth
   - Economic indicators
   - Government policies
   - Infrastructure development

Would you like specific projections for any area?`,
  },
};

export interface MaterialType {
  id: string;
  name: string;
  costPerSqFt: number;
  description: string;
}

export const materialTypes: MaterialType[] = [
  {
    id: "standard",
    name: "Standard Quality",
    costPerSqFt: 3500,
    description: "Basic construction materials suitable for budget projects.",
  },
  {
    id: "medium",
    name: "Medium Quality",
    costPerSqFt: 5000,
    description: "Mid-range materials with better durability and appearance.",
  },
  {
    id: "premium",
    name: "Premium Quality",
    costPerSqFt: 7500,
    description:
      "High-end materials for luxury construction with superior finishes.",
  },
  {
    id: "luxury",
    name: "Luxury Quality",
    costPerSqFt: 10000,
    description:
      "Exclusive materials for high-end luxury constructions with imported finishes.",
  },
];

export interface LaborRate {
  id: string;
  name: string;
  ratePerDay: number;
  description: string;
}

export const laborRates: LaborRate[] = [
  {
    id: "basic",
    name: "Basic Labor",
    ratePerDay: 1000,
    description: "General labor for basic construction tasks.",
  },
  {
    id: "skilled",
    name: "Skilled Labor",
    ratePerDay: 1500,
    description:
      "Skilled workers with experience in specific construction areas.",
  },
  {
    id: "expert",
    name: "Expert Labor",
    ratePerDay: 2500,
    description:
      "Highly experienced professionals for specialized construction work.",
  },
];

export const calculateConstructionCost = (
  area: number,
  materialTypeId: string,
  laborRateId: string,
  durationDays: number
) => {
  const material = materialTypes.find((m) => m.id === materialTypeId);
  const labor = laborRates.find((l) => l.id === laborRateId);

  if (!material || !labor) {
    return {
      success: false,
      error: "Invalid material type or labor rate selected.",
    };
  }

  const materialCost = area * material.costPerSqFt;
  const laborCost = labor.ratePerDay * durationDays;

  const teamSize = Math.ceil(area / 1000) + 2;
  const totalLaborCost = laborCost * teamSize;

  const additionalCosts = materialCost * 0.18;

  const totalCost = materialCost + totalLaborCost + additionalCosts;

  return {
    success: true,
    breakdown: {
      materialCost,
      laborCost: totalLaborCost,
      additionalCosts,
      totalCost,
    },
  };
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  favorites: string[];
  searchHistory: {
    query: string;
    timestamp: string;
  }[];
  role: "user" | "admin";
  loginAttempts: number;
  lastLoginAttempt: string;
}

// Mock user database
interface StoredUser extends AuthUser {
  password: string;
  loginAttempts: number;
  lastLoginAttempt: string | null;
}

const users: StoredUser[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$XQxKGKJ0Q3yZx7zX1Z1Q1O1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q",
    role: "admin",
    favorites: [],
    searchHistory: [],
    loginAttempts: 0,
    lastLoginAttempt: null,
  },
  {
    id: "u2",
    name: "Test User",
    email: "user@example.com",
    password: "$2a$10$XQxKGKJ0Q3yZx7zX1Z1Q1O1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q",
    role: "user",
    favorites: [],
    searchHistory: [],
    loginAttempts: 0,
    lastLoginAttempt: null,
  },
];

// Helper function to create a new user
const createNewUser = (
  id: string,
  name: string,
  email: string,
  role: "user" | "admin"
): AuthUser => {
  return {
    id,
    name,
    email,
    role,
    favorites: [],
    searchHistory: [],
  };
};

export const login = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  // Simulated login - in a real app, this would validate against a backend
  logger.info("Attempting login", { email });

  // Simulate some basic validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user by email
  const user = users.find((u) => u.email === email);

  // If user doesn't exist, throw error
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // In a real app, we would verify the password here
  // For demo purposes, we'll just check if it's one of our test accounts
  if (email === "admin@example.com") {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "admin",
      favorites: user.favorites,
      searchHistory: user.searchHistory,
    };
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: "user",
    favorites: user.favorites,
    searchHistory: user.searchHistory,
  };
};

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<AuthUser> => {
  // Simulated registration - in a real app, this would create a user in the backend
  logger.info("Attempting registration", { email, name });

  // Simulate some basic validation
  if (!email || !password || !name) {
    throw new Error("All fields are required");
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Create new user
  const userId = `user_${Math.random().toString(36).substring(7)}`;
  const role =
    email.endsWith("@admin.com") || email === "admin@example.com"
      ? "admin"
      : "user";

  const newUser: StoredUser = {
    id: userId,
    name,
    email,
    password: "$2a$10$XQxKGKJ0Q3yZx7zX1Z1Q1O1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q", // Hashed password
    role,
    favorites: [],
    searchHistory: [],
    loginAttempts: 0,
    lastLoginAttempt: null,
  };

  users.push(newUser);

  const res = await registerNewUser(newUser);

  logger.info("Registration successful", { userId: newUser.id });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    favorites: newUser.favorites,
    searchHistory: newUser.searchHistory,
  };
};

export const logout = async (): Promise<void> => {
  // In a real app, this would invalidate the session/token on the server
  logger.info("User logged out");
};
export const getRecommendedProperties = async (userId: string) => {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return []; // If no user found, return an empty array
  }

  // Fetching the favorite properties based on user favorites
  const favoriteProperties: Property[] = (
    await Promise.all(user.favorites.map((id) => getPropertyById(id)))
  ).filter(Boolean) as Property[]; // Ensuring no null values

  const favoriteTypes = new Set(favoriteProperties.map((p) => p.type));
  const favoriteAreas = new Set(favoriteProperties.map((p) => p.location.area));

  // Price range based on 20% less and 20% more than favorite properties
  const favoritePriceMin =
    Math.min(...favoriteProperties.map((p) => p.price)) * 0.8;
  const favoritePriceMax =
    Math.max(...favoriteProperties.map((p) => p.price)) * 1.2;

  // Ensure `properties` is available here (e.g., passed in or imported)
  const recommendations = properties.filter(
    (property) =>
      !user.favorites.includes(property.id) && // Filter out favorite properties
      (favoriteTypes.has(property.type) || // Match based on type
        favoriteAreas.has(property.location.area) || // Match based on area
        (property.price >= favoritePriceMin && // Price range check
          property.price <= favoritePriceMax))
  );

  // Sort the recommended properties by score
  return recommendations
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Assign scores based on type match
      if (favoriteTypes.has(a.type)) scoreA += 2;
      if (favoriteTypes.has(b.type)) scoreB += 2;

      // Assign scores based on area match
      if (favoriteAreas.has(a.location.area)) scoreA += 3;
      if (favoriteAreas.has(b.location.area)) scoreB += 3;

      // Assign scores based on price range
      if (a.price >= favoritePriceMin && a.price <= favoritePriceMax) scoreA += 1;
      if (b.price >= favoritePriceMin && b.price <= favoritePriceMax) scoreB += 1;

      return scoreB - scoreA; // Return higher score first
    })
    .slice(0, 4); // Limit to the top 4 recommendations
};

// services/messageService.ts
export const getUnreadMessagesCount = async (userId: string): Promise<number> => {
  try {
    const response = await fetch(`${API_URL}/api/messages/unread-count/${userId}`, {
  method: 'GET',  // Optional, as 'GET' is default
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("authToken")}` // if you have an authentication token
  }
});


    if (!response.ok) {
      throw new Error('Failed to fetch unread message count');
    }

    const data = await response.json();
 
    return data.unreadCount;
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    return 0;  // Return 0 if there's an error
  }
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const predefinedQueries: SuggestedQuery[] = [
  {
    id: "q1",
    text: "What is the process of buying a property in Islamabad?",
    category: "buying",
  },
  {
    id: "q2",
    text: "What documents do I need for renting a property?",
    category: "renting",
  },
  {
    id: "q3",
    text: "Which areas in Islamabad are good for investment?",
    category: "investment",
  },
  {
    id: "q4",
    text: "What are the current property rates in F-7?",
    category: "rates",
  },
  {
    id: "q5",
    text: "What are the current market trends in Islamabad?",
    category: "trends",
  },
  {
    id: "q6",
    text: "How can I verify property documents?",
    category: "buying",
  },
  {
    id: "q7",
    text: "What are the best areas for renting in Islamabad?",
    category: "renting",
  },
  {
    id: "q8",
    text: "What is the expected return on property investment in DHA?",
    category: "investment",
  },
  {
    id: "q9",
    text: "What are the property rates in Bahria Town?",
    category: "rates",
  },
  {
    id: "q10",
    text: "What are the upcoming property developments in Islamabad?",
    category: "trends",
  },
];
