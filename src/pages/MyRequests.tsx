import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Star, Clock, CheckCircle, XCircle, AlertCircle, Smartphone } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RegisterPaymentDialog } from "@/components/payments/RegisterPaymentDialog";
import { usePaymentsByRequest } from "@/hooks/usePayments";

const paymentStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Pagamento pendente", color: "bg-warning/10 text-warning" },
  paid: { label: "Pago - aguarda confirmação", color: "bg-info/10 text-info" },
  confirmed: { label: "Pagamento confirmado", color: "bg-success/10 text-success" },
  rejected: { label: "Pagamento rejeitado", color: "bg-destructive/10 text-destructive" },
};

function PaymentSection({ requestId, isProvider }: { requestId: string; isProvider: boolean }) {
  const { data: payments } = usePaymentsByRequest(requestId);
  if (!payments || payments.length === 0) return null;
  return (
    <div className="mt-3 space-y-1">
      {payments.map((p) => (
        <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-muted/40 rounded">
          <span>💳 {Number(p.amount).toLocaleString("pt-MZ")} MZN {p.transaction_ref && `· ${p.transaction_ref}`}</span>
          <Badge className={paymentStatusMap[p.status]?.color || ""}>
            {paymentStatusMap[p.status]?.label || p.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pendente", color: "bg-warning/10 text-warning", icon: Clock },
  accepted: { label: "Aceito", color: "bg-info/10 text-info", icon: CheckCircle },
  in_progress: { label: "Em andamento", color: "bg-primary/10 text-primary", icon: AlertCircle },
  completed: { label: "Concluído", color: "bg-success/10 text-success", icon: CheckCircle },
  rejected: { label: "Recusado", color: "bg-destructive/10 text-destructive", icon: XCircle },
  cancelled: { label: "Cancelado", color: "bg-muted text-muted-foreground", icon: XCircle },
};

export default function MyRequests() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isProvider = profile?.user_type === "provider";

  const { data: requests, isLoading } = useQuery({
    queryKey: ["my-requests", user?.id, isProvider],
    queryFn: async () => {
      if (!user) return [];
      const column = isProvider ? "provider_id" : "client_id";
      const { data, error } = await supabase
        .from("service_requests")
        .select(`*, service_categories(name, icon)`)
        .eq(column, user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
      const updateData: any = { status };
      if (reason && status === "rejected") updateData.rejection_reason = reason;
      if (reason && status === "cancelled") updateData.cancellation_reason = reason;
      const { error } = await supabase.from("service_requests").update(updateData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      toast.success("Status atualizado com sucesso.");
    },
  });

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [payingRequest, setPayingRequest] = useState<any | null>(null);

  const submitReview = useMutation({
    mutationFn: async ({ requestId, providerId }: { requestId: string; providerId: string }) => {
      const { error } = await supabase.from("reviews").insert({
        client_id: user!.id,
        provider_id: providerId,
        request_id: requestId,
        rating,
        comment: comment || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      toast.success("Avaliação enviada. Obrigado por ajudar a comunidade.");
      setReviewingId(null);
      setComment("");
      setRating(5);
    },
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container-app max-w-3xl">
          <h1 className="text-2xl font-bold mb-6">{isProvider ? "Pedidos Recebidos" : "Meus Pedidos"}</h1>

          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : !requests || requests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  {isProvider ? "Você ainda não recebeu pedidos." : "Você ainda não fez nenhum pedido."}
                </p>
                {!isProvider && (
                  <Button asChild><Link to="/services">Encontrar Profissionais</Link></Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((req: any) => {
                const s = statusMap[req.status] || statusMap.pending;
                const StatusIcon = s.icon;
                return (
                  <Card key={req.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span>{req.service_categories?.icon}</span>
                            <span className="font-medium">{req.service_categories?.name}</span>
                          </div>
                          <Badge className={s.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {s.label}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(req.created_at).toLocaleDateString("pt-MZ")}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{req.description}</p>

                      {req.estimated_budget && (
                        <p className="text-sm mb-1">💰 Orçamento: {req.estimated_budget}</p>
                      )}
                      {req.scheduled_date && (
                        <p className="text-sm mb-1">📅 Data: {new Date(req.scheduled_date).toLocaleDateString("pt-MZ")}</p>
                      )}
                      {(req.city || req.neighborhood) && (
                        <p className="text-sm mb-3">📍 {req.neighborhood && `${req.neighborhood}, `}{req.city}</p>
                      )}

                      {req.rejection_reason && (
                        <p className="text-sm text-destructive mb-3">Motivo da recusa: {req.rejection_reason}</p>
                      )}

                      <PaymentSection requestId={req.id} isProvider={isProvider} />

                      {/* Client: Register M-Pesa payment for active requests */}
                      {!isProvider && ["accepted", "in_progress", "completed"].includes(req.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 mr-2"
                          onClick={() => setPayingRequest(req)}
                        >
                          <Smartphone className="w-4 h-4 mr-1" /> Registar pagamento M-Pesa
                        </Button>
                      )}

                      {/* Provider actions */}
                      {isProvider && req.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => updateStatus.mutate({ id: req.id, status: "accepted" })}>
                            Aceitar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => {
                            const reason = prompt("Motivo da recusa (opcional):");
                            updateStatus.mutate({ id: req.id, status: "rejected", reason: reason || undefined });
                          }}>
                            Recusar
                          </Button>
                        </div>
                      )}

                      {isProvider && req.status === "accepted" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => updateStatus.mutate({ id: req.id, status: "in_progress" })}>
                            Iniciar Trabalho
                          </Button>
                        </div>
                      )}

                      {isProvider && req.status === "in_progress" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => updateStatus.mutate({ id: req.id, status: "completed" })}>
                            Marcar como Concluído
                          </Button>
                        </div>
                      )}

                      {/* Client review */}
                      {!isProvider && req.status === "completed" && reviewingId !== req.id && (
                        <Button size="sm" variant="outline" className="mt-3" onClick={() => setReviewingId(req.id)}>
                          <Star className="w-4 h-4 mr-1" /> Avaliar Profissional
                        </Button>
                      )}

                      {reviewingId === req.id && (
                        <div className="mt-4 p-4 border rounded-lg space-y-3">
                          <p className="font-medium text-sm">Avaliar profissional</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((v) => (
                              <button key={v} onClick={() => setRating(v)} type="button">
                                <Star className={`w-6 h-6 ${v <= rating ? "text-warning fill-warning" : "text-muted"}`} />
                              </button>
                            ))}
                          </div>
                          <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Deixe um comentário (opcional)..."
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => submitReview.mutate({ requestId: req.id, providerId: req.provider_id })}>
                              Enviar Avaliação
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setReviewingId(null)}>Cancelar</Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      {payingRequest && (
        <RegisterPaymentDialog
          open={!!payingRequest}
          onOpenChange={(o) => !o && setPayingRequest(null)}
          requestId={payingRequest.id}
          clientId={payingRequest.client_id}
          providerId={payingRequest.provider_id}
          defaultAmount={payingRequest.estimated_budget}
        />
      )}
    </div>
  );
}
