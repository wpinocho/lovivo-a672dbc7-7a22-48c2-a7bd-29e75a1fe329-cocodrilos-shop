export interface Crocodile {
  id: string;
  name: string;
  species: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  age: number;
  length: number;
  weight: number;
  habitat: string;
  temperament: string;
  diet: string;
  careLevel: 'Beginner' | 'Intermediate' | 'Expert';
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviews: number;
  features: string[];
  category: 'Baby' | 'Juvenile' | 'Adult' | 'Breeding Pair';
  isOnSale: boolean;
  isFeatured: boolean;
  dateAdded: string;
}

export interface CartItem {
  crocodile: Crocodile;
  quantity: number;
}

export interface FilterOptions {
  species: string[];
  priceRange: [number, number];
  careLevel: string[];
  category: string[];
  inStock: boolean;
}