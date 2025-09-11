import { MamakRestaurant } from '@/types/restaurant';

export const mockRestaurants: MamakRestaurant[] = [
  {
    id: '1',
    name: 'Mamak Corner SS15',
    address: 'Jalan SS 15/4b, Ss 15, 47500 Subang Jaya, Selangor',
    coordinates: { lat: 3.0738, lng: 101.5183 },
    tehAisPrice: 1.80,
    rating: 4.2,
    isOpen: true,
    openHours: '24 Hours',
    specialties: ['Roti Canai', 'Teh Ais', 'Mee Goreng'],
    lastUpdated: '2024-01-15T10:30:00Z',
    reviewCount: 1247
  },
  {
    id: '2', 
    name: 'Restoran Pelita',
    address: 'Jalan Ampang, Kuala Lumpur',
    coordinates: { lat: 3.1390, lng: 101.6869 },
    tehAisPrice: 2.20,
    rating: 4.5,
    isOpen: true,
    openHours: '24 Hours',
    specialties: ['Nasi Kandar', 'Teh Ais', 'Curry'],
    lastUpdated: '2024-01-14T16:45:00Z',
    reviewCount: 2156
  },
  {
    id: '3',
    name: 'Mamak Cyberjaya',
    address: 'Persiaran Cyberpoint Selatan, Cyberjaya, Selangor', 
    coordinates: { lat: 2.9213, lng: 101.6559 },
    tehAisPrice: 2.50,
    rating: 4.0,
    isOpen: false,
    openHours: '6:00 AM - 2:00 AM',
    specialties: ['Maggi Goreng', 'Teh Ais', 'Roti Tissue'],
    lastUpdated: '2024-01-13T20:15:00Z',
    reviewCount: 856
  },
  {
    id: '4',
    name: 'Restoran Qasar Hadramawt',
    address: 'Jalan Telawi 3, Bangsar, Kuala Lumpur',
    coordinates: { lat: 3.1319, lng: 101.6741 },
    tehAisPrice: 1.50,
    rating: 4.3,
    isOpen: true,
    openHours: '24 Hours',
    specialties: ['Arabian Cuisine', 'Teh Ais', 'Mandy'],
    lastUpdated: '2024-01-15T08:20:00Z',
    reviewCount: 967
  },
  {
    id: '5',
    name: 'Mamak Razak',
    address: 'Jalan Tun Razak, Kuala Lumpur',
    coordinates: { lat: 3.1478, lng: 101.7089 },
    tehAisPrice: 1.90,
    rating: 4.1,
    isOpen: true,
    openHours: '6:00 AM - 3:00 AM',
    specialties: ['Roti Boom', 'Teh Ais Limau', 'Curry Laksa'],
    lastUpdated: '2024-01-14T14:30:00Z',
    reviewCount: 723
  },
  {
    id: '6',
    name: 'Restoran Al-Bismi',
    address: 'Jalan Bukit Bintang, Kuala Lumpur',
    coordinates: { lat: 3.1478, lng: 101.7123 },
    tehAisPrice: null,
    rating: 4.4,
    isOpen: true,
    openHours: '24 Hours',
    specialties: ['Nasi Briyani', 'Fresh Juice', 'Tandoori'],
    reviewCount: 1834
  }
];