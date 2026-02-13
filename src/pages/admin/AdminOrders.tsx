import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-warning/10 text-warning" },
  accepted: { label: "Aceito", color: "bg-info/10 text-info" },
  in_progress: { label: "Em andamento", color: "bg-primary/10 text-primary" },
  completed: { label: "Concluído", color: "bg-success/10 text-success" },
  rejected: { label: "Recusado", color: "bg-destructive/10 text-destructive" },
  cancelled: { label: "Cancelado", color: "bg-muted text-muted-foreground" },
};

export default function AdminOrders() {
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", filter],
    queryFn: async () => {
      let query = supabase
        .from("service_requests")
        .select("*, service_categories(name, icon)")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch client and provider profiles
      const enriched = await Promise.all(
        (data || []).map(async (order) => {
          const [clientRes, providerRes] = await Promise.all([
            supabase.from("profiles").select("full_name").eq("user_id", order.client_id).maybeSingle(),
            supabase.from("profiles").select("full_name").eq("user_id", order.provider_id).maybeSingle(),
          ]);
          return {
            ...order,
            client_name: clientRes.data?.full_name || "Desconhecido",
            provider_name: providerRes.data?.full_name || "Desconhecido",
          };
        })
      );
      return enriched;
    },
  });

  const cancelOrder = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from("service_requests")
        .update({ status: "cancelled", cancellation_reason: "Cancelado pelo administrador" })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-MZ", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Pedidos</h2>
          <p className="text-muted-foreground">Visualize e gerencie todos os pedidos de serviço</p>
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="accepted">Aceitos</TabsTrigger>
            <TabsTrigger value="in_progress">Em andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
            <TabsTrigger value="rejected">Recusados</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {orders?.length || 0} pedido{orders?.length !== 1 ? "s" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : !orders?.length ? (
                  <p className="text-center py-8 text-muted-foreground">Nenhum pedido encontrado.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Prestador</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Orçamento</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order: any) => {
                          const s = statusConfig[order.status] || statusConfig.pending;
                          return (
                            <TableRow key={order.id}>
                              <TableCell>
                                <span>{order.service_categories?.icon} {order.service_categories?.name}</span>
                              </TableCell>
                              <TableCell>{order.client_name}</TableCell>
                              <TableCell>{order.provider_name}</TableCell>
                              <TableCell><Badge className={s.color}>{s.label}</Badge></TableCell>
                              <TableCell>{order.estimated_budget || "-"}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                              <TableCell className="text-right">
                                {!["completed", "cancelled"].includes(order.status) && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => cancelOrder.mutate(order.id)}
                                  >
                                    Cancelar
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
