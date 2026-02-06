import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProviderWithProfile {
  id: string;
  user_id: string;
  category_id: string;
  description: string | null;
  services: string[];
  price_range: string | null;
  years_experience: number;
  is_verified: boolean;
  is_premium: boolean;
  rating: number;
  review_count: number;
  completed_jobs: number;
  profile: {
    full_name: string;
    avatar_url: string | null;
    city: string | null;
    neighborhood: string | null;
    phone: string | null;
  };
  category: {
    name: string;
    icon: string;
  };
}

interface UseProvidersOptions {
  categoryId?: string;
  city?: string;
  minRating?: number;
  searchQuery?: string;
}

export function useProviders(options: UseProvidersOptions = {}) {
  const { categoryId, city, minRating, searchQuery } = options;

  return useQuery({
    queryKey: ["providers", categoryId, city, minRating, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("provider_profiles")
        .select(`
          *,
          profile:profiles!provider_profiles_user_id_fkey (
            full_name,
            avatar_url,
            city,
            neighborhood,
            phone
          ),
          category:service_categories!provider_profiles_category_id_fkey (
            name,
            icon
          )
        `)
        .eq("is_approved", true)
        .order("is_premium", { ascending: false })
        .order("rating", { ascending: false });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (minRating && minRating > 0) {
        query = query.gte("rating", minRating);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data as unknown as ProviderWithProfile[];

      // Filter by city (client-side since it's in a nested object)
      if (city) {
        filteredData = filteredData.filter(
          (p) => p.profile?.city?.toLowerCase() === city.toLowerCase()
        );
      }

      // Filter by search query
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (p) =>
            p.profile?.full_name?.toLowerCase().includes(search) ||
            p.description?.toLowerCase().includes(search) ||
            p.services?.some((s) => s.toLowerCase().includes(search))
        );
      }

      return filteredData;
    },
  });
}
