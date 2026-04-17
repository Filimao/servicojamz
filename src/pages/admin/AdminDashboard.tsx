import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Clock, Star, FolderOpen, FileText } from "lucide-react";
import { RevenueWidget } from "@/components/admin/RevenueWidget";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: "Utilizadores",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Prestadores Aprovados",
      value: stats?.approvedProviders || 0,
      icon: UserCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Prestadores Pendentes",
      value: stats?.pendingProviders || 0,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Total Pedidos",
      value: stats?.totalRequests || 0,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Avaliações",
      value: stats?.totalReviews || 0,
      icon: Star,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Categorias",
      value: stats?.totalCategories || 0,
      icon: FolderOpen,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral da plataforma ServiçoJá
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-8 w-8 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.title} className="card-interactive">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <RevenueWidget />

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/admin/providers"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Aprovar Prestadores</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.pendingProviders || 0} pendentes
                  </p>
                </div>
              </a>
              <a
                href="/admin/categories"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <div className="p-2 rounded-lg bg-secondary/10">
                  <FolderOpen className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Gerir Categorias</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalCategories || 0} categorias
                  </p>
                </div>
              </a>
              <a
                href="/admin/users"
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <div className="p-2 rounded-lg bg-info/10">
                  <Users className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Ver Utilizadores</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalUsers || 0} registados
                  </p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
