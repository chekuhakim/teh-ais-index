import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MamakRestaurant, PriceEntry } from '@/types/restaurant';

const RESTAURANTS_COLLECTION = 'restaurants';
const PRICES_COLLECTION = 'prices';

export class RestaurantService {
  // Get all restaurants
  static async getAllRestaurants(): Promise<MamakRestaurant[]> {
    try {
      const restaurantsRef = collection(db, RESTAURANTS_COLLECTION);
      const q = query(restaurantsRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MamakRestaurant[];
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }

  // Get restaurant by ID
  static async getRestaurantById(id: string): Promise<MamakRestaurant | null> {
    try {
      const restaurantRef = doc(db, RESTAURANTS_COLLECTION, id);
      const restaurantSnap = await getDoc(restaurantRef);
      
      if (restaurantSnap.exists()) {
        return {
          id: restaurantSnap.id,
          ...restaurantSnap.data()
        } as MamakRestaurant;
      }
      return null;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  }

  // Add new restaurant
  static async addRestaurant(restaurant: Omit<MamakRestaurant, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, RESTAURANTS_COLLECTION), {
        ...restaurant,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding restaurant:', error);
      throw error;
    }
  }

  // Update restaurant
  static async updateRestaurant(id: string, updates: Partial<MamakRestaurant>): Promise<void> {
    try {
      const restaurantRef = doc(db, RESTAURANTS_COLLECTION, id);
      await updateDoc(restaurantRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  }

  // Update restaurant with all food prices
  static async updateRestaurantPrices(
    restaurantId: string, 
    priceUpdates: {
      tehAisPrice?: number | null;
      rotiCanaiPrice?: number | null;
      meeGorengPrice?: number | null;
      nasiLemakPrice?: number | null;
      tehTarikPrice?: number | null;
      nasiKandarPrice?: number | null;
      rotiTelurPrice?: number | null;
    },
    userId?: string,
    username?: string,
    contributorLevel?: string,
    showEmail?: boolean
  ): Promise<void> {
    try {
      const now = Timestamp.now();
      
      // Update restaurant document with all prices
      const restaurantRef = doc(db, RESTAURANTS_COLLECTION, restaurantId);
      await updateDoc(restaurantRef, {
        ...priceUpdates,
        lastUpdated: now,
        lastUpdatedBy: username || 'Anonymous',
        lastUpdatedByLevel: contributorLevel || 'newbie',
        updatedAt: now
      });

      // Add price entry to prices collection for tehAisPrice if it was updated
      if (priceUpdates.tehAisPrice !== undefined && priceUpdates.tehAisPrice !== null) {
        await addDoc(collection(db, PRICES_COLLECTION), {
          restaurantId,
          price: priceUpdates.tehAisPrice,
          timestamp: now,
          userId: userId || null,
          username: username || 'Anonymous',
          contributorLevel: contributorLevel || 'newbie',
          showEmail: showEmail || false
        } as Omit<PriceEntry, 'id'>);
      }
    } catch (error) {
      console.error('Error updating restaurant prices:', error);
      throw error;
    }
  }

  // Update restaurant price
  static async updateRestaurantPrice(
    restaurantId: string, 
    price: number, 
    userId?: string, 
    username?: string,
    contributorLevel?: string,
    showEmail?: boolean
  ): Promise<void> {
    try {
      const now = Timestamp.now();
      
      // Update restaurant document
      const restaurantRef = doc(db, RESTAURANTS_COLLECTION, restaurantId);
      await updateDoc(restaurantRef, {
        tehAisPrice: price,
        lastUpdated: now,
        lastUpdatedBy: username || 'Anonymous',
        lastUpdatedByLevel: contributorLevel || 'newbie',
        updatedAt: now
      });

      // Add price entry to prices collection
      await addDoc(collection(db, PRICES_COLLECTION), {
        restaurantId,
        price,
        timestamp: now,
        userId: userId || null,
        username: username || 'Anonymous',
        contributorLevel: contributorLevel || 'newbie',
        showEmail: showEmail || false
      } as Omit<PriceEntry, 'id'>);
    } catch (error) {
      console.error('Error updating restaurant price:', error);
      throw error;
    }
  }

  // Get price history for a restaurant
  static async getPriceHistory(restaurantId: string): Promise<PriceEntry[]> {
    try {
      const pricesRef = collection(db, PRICES_COLLECTION);
      const q = query(
        pricesRef, 
        where('restaurantId', '==', restaurantId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PriceEntry[];
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }

  // Search restaurants by name or location
  static async searchRestaurants(searchTerm: string): Promise<MamakRestaurant[]> {
    try {
      const restaurantsRef = collection(db, RESTAURANTS_COLLECTION);
      const q = query(restaurantsRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const allRestaurants = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MamakRestaurant[];

      // Filter by search term (case-insensitive)
      const searchLower = searchTerm.toLowerCase();
      return allRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchLower) ||
        restaurant.address.toLowerCase().includes(searchLower) ||
        restaurant.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchLower)
        )
      );
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error;
    }
  }

  // Get restaurants by price range
  static async getRestaurantsByPriceRange(minPrice: number, maxPrice: number): Promise<MamakRestaurant[]> {
    try {
      const restaurantsRef = collection(db, RESTAURANTS_COLLECTION);
      const q = query(
        restaurantsRef,
        where('tehAisPrice', '>=', minPrice),
        where('tehAisPrice', '<=', maxPrice),
        orderBy('tehAisPrice')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MamakRestaurant[];
    } catch (error) {
      console.error('Error fetching restaurants by price range:', error);
      throw error;
    }
  }
}
