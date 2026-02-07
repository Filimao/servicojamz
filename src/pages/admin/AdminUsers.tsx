import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Phone, MapPin } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  neighborhood: string | null;
  user_type: "client" | "provider";
  created_at: string;
}

export default function AdminUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UserProfile[];
    },
  });

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
          <h2 className="text-2xl font-bold text-foreground">Utilizadores</h2>
          <p className="text-muted-foreground">
            Lista de todos os utilizadores registados na plataforma
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lista de Utilizadores</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                A carregar...
              </div>
            ) : !users?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum utilizador encontrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilizador</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data de Registo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {user.full_name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.user_type === "provider"
                                ? "bg-secondary/10 text-secondary border-secondary/20"
                                : "bg-info/10 text-info border-info/20"
                            }
                          >
                            {user.user_type === "provider" ? "Prestador" : "Cliente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.phone ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              {user.phone}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.city ? (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              {user.city}
                              {user.neighborhood && `, ${user.neighborhood}`}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.created_at)}
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
