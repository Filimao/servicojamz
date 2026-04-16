import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Payment {
  id: string;
  request_id: string;
  client_id: string;
  provider_id: string;
  amount: number;
  method: string;
  mpesa_number: string | null;
  transaction_ref: string | null;
  status: "pending" | "paid" | "confirmed" | "rejected";
  notes: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export function usePaymentsByRequest(requestId?: string) {
  return useQuery({
    queryKey: ["payments", "request", requestId],
    enabled: !!requestId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("request_id", requestId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Payment[];
    },
  });
}

export function useAllPayments() {
  return useQuery({
    queryKey: ["payments", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Payment[];
    },
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      request_id: string;
      client_id: string;
      provider_id: string;
      amount: number;
      mpesa_number?: string;
      transaction_ref?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("payments")
        .insert({ ...input, status: "paid" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pagamento registado. Aguarda confirmação.");
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao registar pagamento"),
  });
}

export function useUpdatePaymentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      status: Payment["status"];
      notes?: string;
    }) => {
      const updates: any = { status: input.status };
      if (input.notes !== undefined) updates.notes = input.notes;
      if (input.status === "confirmed" || input.status === "rejected") {
        const { data: { user } } = await supabase.auth.getUser();
        updates.confirmed_by = user?.id;
        updates.confirmed_at = new Date().toISOString();
      }
      const { data, error } = await supabase
        .from("payments")
        .update(updates)
        .eq("id", input.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pagamento atualizado");
    },
    onError: (e: any) => toast.error(e?.message || "Erro ao atualizar pagamento"),
  });
}
