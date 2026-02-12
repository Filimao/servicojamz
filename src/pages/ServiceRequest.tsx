import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Send, CalendarIcon, MapPin } from "lucide-react";

export default function ServiceRequest() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    description: "",
    scheduledDate: "",
    city: "",
    neighborhood: "",
    estimatedBudget: "",
  });

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider-for-request", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_profiles")
        .select(`*, service_categories(name, icon), profiles:profiles!provider_profiles_user_id_fkey(full_name)`)
        .eq("id", providerId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <h2 className="text-xl font-bold">Faça login para solicitar serviço</h2>
              <p className="text-muted-foreground">Precisa ter uma conta para solicitar serviços.</p>
              <Button asChild className="w-full"><Link to="/auth">Entrar / Cadastrar</Link></Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) {
      toast.error("Por favor, descreva o serviço que precisa.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("service_requests").insert({
        client_id: user.id,
        provider_id: provider.user_id,
        category_id: provider.category_id,
        description: form.description,
        scheduled_date: form.scheduledDate || null,
        city: form.city || null,
        neighborhood: form.neighborhood || null,
        estimated_budget: form.estimatedBudget || null,
      });
      if (error) throw error;

      // Create notification for provider
      await supabase.from("notifications").insert({
        user_id: provider.user_id,
        title: "Novo pedido de serviço",
        message: `Você recebeu um novo pedido de serviço. Acesse seus pedidos para ver os detalhes.`,
        type: "new_request",
        link: "/painel",
      });

      toast.success("Pedido enviado com sucesso. O profissional entrará em contacto.");
      navigate("/meus-pedidos");
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container-app max-w-2xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link to={`/profissional/${providerId}`}><ArrowLeft className="w-4 h-4 mr-2" />Voltar ao perfil</Link>
          </Button>

          <h1 className="text-2xl font-bold mb-2">Solicitar Serviço</h1>
          <p className="text-muted-foreground mb-6">
            Envie um pedido para <strong>{(provider as any)?.profiles?.full_name}</strong> ({(provider as any)?.service_categories?.name})
          </p>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Descrição do serviço <span className="text-destructive">*</span></Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descreva detalhadamente o serviço que precisa..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label><CalendarIcon className="w-4 h-4 inline mr-1" />Data desejada</Label>
                    <Input
                      type="date"
                      value={form.scheduledDate}
                      onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Orçamento estimado</Label>
                    <Input
                      value={form.estimatedBudget}
                      onChange={(e) => setForm({ ...form, estimatedBudget: e.target.value })}
                      placeholder="Ex: 2.000 MZN"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label><MapPin className="w-4 h-4 inline mr-1" />Cidade</Label>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Ex: Maputo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bairro</Label>
                    <Input
                      value={form.neighborhood}
                      onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                      placeholder="Ex: Polana"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {isSubmitting ? "Enviando..." : "Enviar Pedido"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  A plataforma apenas conecta clientes e profissionais. O pagamento é feito diretamente entre as partes.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
