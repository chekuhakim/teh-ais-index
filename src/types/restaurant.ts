export type ContributorLevel = 'newbie' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  contributorLevel: ContributorLevel;
  contributionCount: number;
  showEmail: boolean;
  joinedAt: string;
}

export interface MamakRestaurant {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tehAisPrice: number | null;
  // Optional food prices
  rotiCanaiPrice?: number | null;
  meeGorengPrice?: number | null;
  nasiLemakPrice?: number | null;
  tehTarikPrice?: number | null;
  nasiKandarPrice?: number | null;
  rotiTelurPrice?: number | null;
  rating: number;
  isOpen: boolean;
  openHours: string;
  specialties: string[];
  lastUpdated?: string;
  lastUpdatedBy?: string;
  lastUpdatedByLevel?: ContributorLevel;
  priceHistory?: PriceEntry[];
  reviewCount: number;
}

export interface PriceEntry {
  restaurantId: string;
  price: number;
  timestamp: string;
  userId?: string;
  username?: string;
  contributorLevel?: ContributorLevel;
  showEmail?: boolean;
}