import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useAdminProviders,
  useApproveProvider,
  useToggleVerified,
  useTogglePremium,
} from "@/hooks/useAdminProviders";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  X,
  MoreHorizontal,
  Shield,
  Crown,
  Phone,
  MapPin,
} from "lucide-react";

export default function AdminProviders() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const { data: providers, isLoading } = useAdminProviders(filter);
  const approveProvider = useApproveProvider();
  const toggleVerified = useToggleVerified();
  const togglePremium = useTogglePremium();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Prestadores</h2>
          <p className="text-muted-foreground">
            Aprove, rejeite e gerencie prestadores de serviços
          </p>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="approved">Aprovados</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {filter === "pending" && "Prestadores Aguardando Aprovação"}
                  {filter === "approved" && "Prestadores Aprovados"}
                  {filter === "all" && "Todos os Prestadores"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    A carregar...
                  </div>
                ) : !providers?.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum prestador encontrado.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Prestador</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Localização</TableHead>
                          <TableHead>Contacto</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {providers.map((provider) => (
                          <TableRow key={provider.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {provider.profile?.full_name?.charAt(0) || "?"}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {provider.profile?.full_name || "Sem nome"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {provider.years_experience || 0} anos de experiência
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CategoryIcon icon={provider.category?.icon} className="w-4 h-4" />
                                <span>{provider.category?.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                {provider.profile?.city || "Não informado"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {provider.profile?.phone && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  {provider.profile.phone}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {provider.is_approved ? (
                                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                    Aprovado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                    Pendente
                                  </Badge>
                                )}
                                {provider.is_verified && (
                                  <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verificado
                                  </Badge>
                                )}
                                {provider.is_premium && (
                                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(provider.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!provider.is_approved && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        approveProvider.mutate({
                                          providerId: provider.id,
                                          approve: true,
                                        })
                                      }
                                    >
                                      <Check className="w-4 h-4 mr-2 text-success" />
                                      Aprovar
                                    </DropdownMenuItem>
                                  )}
                                  {provider.is_approved && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        approveProvider.mutate({
                                          providerId: provider.id,
                                          approve: false,
                                        })
                                      }
                                    >
                                      <X className="w-4 h-4 mr-2 text-destructive" />
                                      Remover Aprovação
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleVerified.mutate({
                                        providerId: provider.id,
                                        verified: !provider.is_verified,
                                      })
                                    }
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    {provider.is_verified ? "Remover Verificação" : "Verificar"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      togglePremium.mutate({
                                        providerId: provider.id,
                                        premium: !provider.is_premium,
                                      })
                                    }
                                  >
                                    <Crown className="w-4 h-4 mr-2" />
                                    {provider.is_premium ? "Remover Premium" : "Tornar Premium"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
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
