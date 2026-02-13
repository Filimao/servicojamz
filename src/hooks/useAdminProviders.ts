import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProviderWithProfile {
  id: string;
  user_id: string;
  category_id: string;
  description: string | null;
  services: string[] | null;
  price_range: string | null;
  years_experience: number | null;
  is_approved: boolean;
  is_verified: boolean;
  is_premium: boolean;
  created_at: string;
  profile: {
    full_name: string;
    phone: string | null;
    city: string | null;
    neighborhood: string | null;
  } | null;
  category: {
    name: string;
    icon: string;
  } | null;
}

export function useAdminProviders(filter: "all" | "pending" | "approved" = "all") {
  return useQuery({
    queryKey: ["admin-providers", filter],
    queryFn: async () => {
      let query = supabase
        .from("provider_profiles")
        .select(`
          *,
          category:service_categories(name, icon)
        `)
        .order("created_at", { ascending: false });

      if (filter === "pending") {
        query = query.eq("is_approved", false);
      } else if (filter === "approved") {
        query = query.eq("is_approved", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Fetch profiles separately for each provider
      const providerData = data || [];
      const profilePromises = providerData.map(async (provider) => {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, phone, city, neighborhood")
          .eq("user_id", provider.user_id)
          .maybeSingle();
        return { ...provider, profile: profileData };
      });
      
      const providersWithProfiles = await Promise.all(profilePromises);
      
      // Transform the data to match expected shape
      return providersWithProfiles.map(item => ({
        ...item,
        category: Array.isArray(item.category) ? item.category[0] : item.category,
      })) as ProviderWithProfile[];
    },
  });
}

export function useApproveProvider() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ providerId, approve }: { providerId: string; approve: boolean }) => {
      const { error } = await supabase
        .from("provider_profiles")
        .update({ is_approved: approve })
        .eq("id", providerId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      toast({
        title: variables.approve ? "Prestador aprovado" : "Prestador rejeitado",
        description: variables.approve
          ? "O prestador agora está visível na plataforma."
          : "O prestador foi removido da lista pública.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível processar a solicitação.",
        variant: "destructive",
      });
    },
  });
}

export function useToggleVerified() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ providerId, verified }: { providerId: string; verified: boolean }) => {
      const { error } = await supabase
        .from("provider_profiles")
        .update({ is_verified: verified })
        .eq("id", providerId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
      toast({
        title: variables.verified ? "Prestador verificado" : "Verificação removida",
      });
    },
  });
}

export function useTogglePremium() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ providerId, premium }: { providerId: string; premium: boolean }) => {
      const { error } = await supabase
        .from("provider_profiles")
        .update({ is_premium: premium })
        .eq("id", providerId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
      toast({
        title: variables.premium ? "Prestador promovido a Premium" : "Premium removido",
      });
    },
  });
}
