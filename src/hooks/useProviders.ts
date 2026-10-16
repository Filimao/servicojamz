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
  is_demo?: boolean;
  is_registered?: boolean;
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
      // 1) Fetch approved providers with category (no FK to profiles, so join manually)
      let query = supabase
        .from("provider_profiles")
        .select(`
          *,
          category:service_categories!provider_profiles_category_id_fkey (
            name,
            icon
          )
        `)
        .eq("is_approved", true)
        .order("is_premium", { ascending: false })
        .order("rating", { ascending: false })
        .order("review_count", { ascending: false })
        .order("created_at", { ascending: false });

      if (categoryId) query = query.eq("category_id", categoryId);
      if (minRating && minRating > 0) query = query.gte("rating", minRating);

      const { data: providersData, error } = await query;
      if (error) {
        console.error("[useProviders] error fetching providers:", error);
        throw error;
      }
      if (!providersData || providersData.length === 0) return [];

      // 2) Fetch matching profiles separately
      const userIds = providersData.map((p: any) => p.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, city, neighborhood, phone")
        .in("user_id", userIds);

      if (profilesError) {
        console.error("[useProviders] error fetching profiles:", profilesError);
        throw profilesError;
      }

      const profilesMap = new Map(
        (profilesData || []).map((p: any) => [p.user_id, p])
      );

      // 3) Merge
      let merged: ProviderWithProfile[] = providersData.map((p: any) => ({
        ...p,
        profile: profilesMap.get(p.user_id) || {
          full_name: "Profissional",
          avatar_url: null,
          city: null,
          neighborhood: null,
          phone: null,
        },
      }));

      // 4) Client-side filters
      if (city) {
        merged = merged.filter(
          (p) => p.profile?.city?.toLowerCase() === city.toLowerCase()
        );
      }

      if (searchQuery) {
        const s = searchQuery.toLowerCase();
        merged = merged.filter(
          (p) =>
            p.profile?.full_name?.toLowerCase().includes(s) ||
            p.profile?.city?.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.services?.some((srv) => srv.toLowerCase().includes(s))
        );
      }

      return merged;
    },
  });
}
