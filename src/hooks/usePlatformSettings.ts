import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PlatformSettings {
  id: string;
  platform_name: string;
  platform_description: string | null;
  logo_url: string | null;
  support_email: string | null;
  contact_phone: string | null;
  location: string | null;
  require_login: boolean;
  allow_provider_signup: boolean;
}

export function usePlatformSettings() {
  return useQuery({
    queryKey: ["platform-settings"],
    queryFn: async (): Promise<PlatformSettings | null> => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("[usePlatformSettings]", error);
        throw error;
      }
      return data as PlatformSettings | null;
    },
  });
}

export function useUpdatePlatformSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PlatformSettings> & { id: string }) => {
      const { id, ...updates } = payload;
      const { data, error } = await supabase
        .from("platform_settings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform-settings"] });
      toast.success("Configurações guardadas");
    },
    onError: (e: any) => {
      console.error(e);
      toast.error(e?.message || "Erro ao guardar configurações");
    },
  });
}
