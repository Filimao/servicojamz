import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Wallet } from "lucide-react";
import { useAllPayments, useUpdatePaymentStatus } from "@/hooks/usePayments";

const statusVariant = (s: string) => {
  switch (s) {
    case "confirmed": return { label: "Confirmado", className: "bg-success/10 text-success border-success/20" };
    case "paid": return { label: "Pago (aguarda)", className: "bg-warning/10 text-warning border-warning/20" };
    case "rejected": return { label: "Rejeitado", className: "bg-destructive/10 text-destructive border-destructive/20" };
    default: return { label: "Pendente", className: "bg-muted text-muted-foreground border-border" };
  }
};

export default function AdminPayments() {
  const { data: payments, isLoading } = useAllPayments();
  const updateStatus = useUpdatePaymentStatus();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" /> Pagamentos M-Pesa
          </h2>
          <p className="text-muted-foreground">Confirme manualmente os pagamentos realizados pelos clientes</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !payments || payments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Ainda não existem pagamentos registados.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {payments.map((p) => {
              const v = statusVariant(p.status);
              return (
                <Card key={p.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle className="text-base">
                          {Number(p.amount).toLocaleString("pt-PT")} MZN — {p.method.toUpperCase()}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pedido: <span className="font-mono">{p.request_id.slice(0, 8)}</span> · {new Date(p.created_at).toLocaleString("pt-PT")}
                        </p>
                      </div>
                      <Badge variant="outline" className={v.className}>{v.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Nº M-Pesa:</span> <span className="font-medium text-foreground">{p.mpesa_number || "—"}</span></div>
                      <div><span className="text-muted-foreground">Referência:</span> <span className="font-mono text-foreground">{p.transaction_ref || "—"}</span></div>
                    </div>
                    {p.notes && <p className="text-sm text-muted-foreground italic">"{p.notes}"</p>}

                    {p.status !== "confirmed" && p.status !== "rejected" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="hero"
                          onClick={() => updateStatus.mutate({ id: p.id, status: "confirmed" })}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4" /> Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: p.id, status: "rejected" })}
                          disabled={updateStatus.isPending}
                        >
                          <XCircle className="w-4 h-4" /> Rejeitar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
