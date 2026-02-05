export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  providerCount: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  category: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  description: string;
  services: string[];
  priceRange: string;
  isPremium: boolean;
  isVerified: boolean;
  phone: string;
  yearsExperience: number;
  completedJobs: number;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  providerId: string;
  categoryId: string;
  description: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: Date;
  scheduledDate?: Date;
}

export interface Review {
  id: string;
  providerId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
