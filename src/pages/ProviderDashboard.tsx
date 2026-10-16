import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2, Briefcase, Star, CheckCircle, Clock, TrendingUp,
  Eye, Crown, Upload, Trash2, Image as ImageIcon
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { CategoryIcon } from "@/components/CategoryIcon";

export default function ProviderDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: providerProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["my-provider-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_profiles")
        .select("*, service_categories(name, icon)")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["provider-stats", user?.id],
    queryFn: async () => {
      const { data: requests } = await supabase
        .from("service_requests")
        .select("status")
        .eq("provider_id", user!.id);

      const total = requests?.length || 0;
      const accepted = requests?.filter((r: any) => ["accepted", "in_progress", "completed"].includes(r.status)).length || 0;
      const completed = requests?.filter((r: any) => r.status === "completed").length || 0;
      const pending = requests?.filter((r: any) => r.status === "pending").length || 0;

      return {
        total,
        accepted,
        completed,
        pending,
        acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
      };
    },
    enabled: !!user,
  });

  const { data: workPhotos, refetch: refetchPhotos } = useQuery({
    queryKey: ["work-photos", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_photos")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    const maxPhotos = providerProfile?.is_premium ? 50 : 5;
    const currentCount = workPhotos?.length || 0;

    if (currentCount + files.length > maxPhotos) {
      toast.error(`Limite de ${maxPhotos} fotos no seu plano. Atualize para Premium para mais.`);
      return;
    }

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} excede 5MB. Tente uma imagem menor.`);
          continue;
        }

        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("work-photos")
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("work-photos")
          .getPublicUrl(path);

        await supabase.from("work_photos").insert({
          user_id: user.id,
          url: publicUrl,
        });
      }
      toast.success("Fotos enviadas com sucesso!");
      refetchPhotos();
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao enviar fotos.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async (photoId: string, url: string) => {
    try {
      // Extract path from URL
      const pathMatch = url.match(/work-photos\/(.+)$/);
      if (pathMatch) {
        await supabase.storage.from("work-photos").remove([pathMatch[1]]);
      }
      await supabase.from("work_photos").delete().eq("id", photoId);
      toast.success("Foto removida.");
      refetchPhotos();
    } catch {
      toast.error("Erro ao remover foto.");
    }
  };

  if (!user) { navigate("/auth"); return null; }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main>
        <Footer />
      </div>
    );
  }

  if (!providerProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container-app max-w-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Você ainda não é um profissional</h1>
            <p className="text-muted-foreground mb-6">Cadastre-se como profissional para acessar o painel.</p>
            <Button asChild><Link to="/cadastro-profissional">Cadastrar como Profissional</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const planName = providerProfile.is_premium ? "Premium" : "Gratuito";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Painel do Profissional</h1>
              <p className="text-muted-foreground">Olá, {profile?.full_name}!</p>
            </div>
            <div className="flex gap-2">
              <Badge className={providerProfile.is_approved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                {providerProfile.is_approved ? "Aprovado" : "Aguardando Aprovação"}
              </Badge>
              <Badge variant="outline">{planName}</Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total Pedidos", value: stats?.total || 0, icon: Briefcase, color: "text-primary" },
              { label: "Aceitos", value: stats?.accepted || 0, icon: CheckCircle, color: "text-success" },
              { label: "Pendentes", value: stats?.pending || 0, icon: Clock, color: "text-warning" },
              { label: "Concluídos", value: stats?.completed || 0, icon: TrendingUp, color: "text-info" },
              { label: "Avaliação", value: providerProfile.rating?.toFixed(1) || "0.0", icon: Star, color: "text-warning" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 text-center">
                  <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Ações Rápidas</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button asChild><Link to="/meus-pedidos">Ver Pedidos</Link></Button>
                  <Button variant="outline" asChild><Link to={`/profissional/${providerProfile.id}`}><Eye className="w-4 h-4 mr-1" />Ver Meu Perfil</Link></Button>
                </CardContent>
              </Card>

              {/* Work Gallery */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" /> Galeria de Trabalhos
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {workPhotos?.length || 0}/{providerProfile.is_premium ? "50" : "5"} fotos
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleUploadPhoto}
                  />
                  <Button
                    variant="outline"
                    className="w-full mb-4"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {uploading ? "Enviando..." : "Adicionar Fotos"}
                  </Button>

                  {workPhotos && workPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {workPhotos.map((photo: any) => (
                        <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-square">
                          <img src={photo.url} alt="Trabalho" className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleDeletePhoto(photo.id, photo.url)}
                            className="absolute top-2 right-2 p-1.5 bg-destructive/80 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Adicione fotos dos seus trabalhos para atrair mais clientes.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Plan Status */}
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Crown className="w-5 h-5" /> Seu Plano</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Plano atual</p>
                    <p className="text-xl font-bold">{planName}</p>
                    <p className="text-sm text-muted-foreground">
                      {providerProfile.is_premium ? "Pedidos ilimitados" : "Até 5 pedidos/mês"}
                    </p>
                  </div>

                  {!providerProfile.is_premium && (
                    <Button asChild className="w-full" variant="default">
                      <Link to="/para-profissionais#planos">
                        <Crown className="w-4 h-4 mr-2" /> Tornar-se Premium
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Profile Info */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Informações</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="flex items-center gap-1"><strong>Categoria:</strong> <CategoryIcon icon={(providerProfile as any).service_categories?.icon} className="w-4 h-4" /> {(providerProfile as any).service_categories?.name}</p>
                  <p><strong>Experiência:</strong> {providerProfile.years_experience || 0} anos</p>
                  <p><strong>Trabalhos concluídos:</strong> {providerProfile.completed_jobs || 0}</p>
                  <p><strong>Avaliações:</strong> {providerProfile.review_count || 0}</p>
                  {providerProfile.is_verified && (
                    <Badge className="bg-success/10 text-success"><CheckCircle className="w-3 h-3 mr-1" />Verificado</Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
