import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  pendingProviders: number;
  approvedProviders: number;
  totalRequests: number;
  totalReviews: number;
  totalCategories: number;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      // Fetch all counts in parallel
      const [
        profilesRes,
        providersRes,
        pendingRes,
        approvedRes,
        requestsRes,
        reviewsRes,
        categoriesRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("provider_profiles").select("id", { count: "exact", head: true }),
        supabase.from("provider_profiles").select("id", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("provider_profiles").select("id", { count: "exact", head: true }).eq("is_approved", true),
        supabase.from("service_requests").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("service_categories").select("id", { count: "exact", head: true }),
      ]);

      return {
        totalUsers: profilesRes.count || 0,
        totalProviders: providersRes.count || 0,
        pendingProviders: pendingRes.count || 0,
        approvedProviders: approvedRes.count || 0,
        totalRequests: requestsRes.count || 0,
        totalReviews: reviewsRes.count || 0,
        totalCategories: categoriesRes.count || 0,
      };
    },
  });
}
