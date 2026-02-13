import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminReports() {
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const enriched = await Promise.all(
        (data || []).map(async (r) => {
          const [reporterRes, reportedRes] = await Promise.all([
            supabase.from("profiles").select("full_name").eq("user_id", r.reporter_id).maybeSingle(),
            supabase.from("profiles").select("full_name").eq("user_id", r.reported_user_id).maybeSingle(),
          ]);
          return {
            ...r,
            reporter_name: reporterRes.data?.full_name || "Desconhecido",
            reported_name: reportedRes.data?.full_name || "Desconhecido",
          };
        })
      );
      return enriched;
    },
  });

  const updateReport = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("reports").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Denúncia atualizada.");
    },
  });

  const statusColor: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    resolved: "bg-success/10 text-success",
    dismissed: "bg-muted text-muted-foreground",
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-MZ", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Denúncias</h2>
          <p className="text-muted-foreground">Revise e resolva denúncias de utilizadores</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              {reports?.length || 0} denúncia{reports?.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : !reports?.length ? (
              <p className="text-center py-8 text-muted-foreground">Nenhuma denúncia encontrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Denunciante</TableHead>
                      <TableHead>Denunciado</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.reporter_name}</TableCell>
                        <TableCell className="font-medium">{report.reported_name}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {report.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor[report.status] || statusColor.pending}>
                            {report.status === "pending" ? "Pendente" : report.status === "resolved" ? "Resolvida" : "Rejeitada"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(report.created_at)}</TableCell>
                        <TableCell className="text-right">
                          {report.status === "pending" && (
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: report.id, status: "resolved" })}>
                                <CheckCircle className="w-3 h-3 mr-1" /> Resolver
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => updateReport.mutate({ id: report.id, status: "dismissed" })}>
                                <XCircle className="w-3 h-3 mr-1" /> Rejeitar
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
