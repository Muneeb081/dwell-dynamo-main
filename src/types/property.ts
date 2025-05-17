export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    area: string;
    address: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    furnished: boolean;
    parking: boolean;
  };
  images: string[];
  type: 'house' | 'apartment' | 'commercial' | 'plot';
  status: 'sale' | 'rent';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PropertyResponse {
  message?: string;
  property: Property;
}

export interface PropertiesResponse {
  properties: Property[];
}
