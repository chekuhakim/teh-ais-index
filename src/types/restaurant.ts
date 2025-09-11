export interface MamakRestaurant {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tehAisPrice: number | null;
  rating: number;
  isOpen: boolean;
  openHours: string;
  specialties: string[];
  lastUpdated?: string;
  reviewCount: number;
}

export interface PriceEntry {
  restaurantId: string;
  price: number;
  timestamp: string;
  userId?: string;
}