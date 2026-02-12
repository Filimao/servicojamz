import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Shield, 
  Award,
  Clock,
  Briefcase,
  Send,
  Loader2,
  ArrowLeft,
  CheckCircle
} from "lucide-react";

export default function ProviderProfile() {
  const { id } = useParams();
  const { user } = useAuth();

  // Fetch provider data
  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: async () => {
      // First get the provider profile
      const { data: providerData, error: providerError } = await supabase
        .from("provider_profiles")
        .select(`
          *,
          service_categories (
            name,
            icon
          )
        `)
        .eq("id", id)
        .single();

      if (providerError) throw providerError;

      // Then get the user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", providerData.user_id)
        .single();

      return {
        ...providerData,
        profile: profileData
      };
    },
    enabled: !!id
  });

  // Fetch reviews
  const { data: reviews } = useQuery({
    queryKey: ["provider-reviews", id],
    queryFn: async () => {
      if (!provider?.user_id) return [];
      
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles!reviews_client_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq("provider_id", provider.user_id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!provider?.user_id
  });

  // Fetch work photos
  const { data: workPhotos } = useQuery({
    queryKey: ["provider-work-photos", provider?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_photos")
        .select("*")
        .eq("user_id", provider!.user_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!provider?.user_id
  });


  const handleWhatsApp = () => {
    const phone = provider?.profile?.phone;
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/258${cleanPhone}`;
      window.open(whatsappUrl, "_blank");
    } else {
      toast.error("Telefone não disponível");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container-app text-center">
            <h1 className="text-2xl font-bold mb-4">Profissional não encontrado</h1>
            <Button asChild>
              <Link to="/services">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Serviços
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const profile = provider.profile;
  const category = provider.service_categories;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container-app">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/services">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Serviços
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {profile?.full_name?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
                        {provider.is_verified && (
                          <Badge className="bg-success/10 text-success border-success/20">
                            <Shield className="w-3 h-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                        {provider.is_premium && (
                          <Badge className="bg-warning/10 text-warning border-warning/20">
                            <Award className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <span>{category?.icon}</span>
                        <span>{category?.name}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-medium">{provider.rating?.toFixed(1) || "0.0"}</span>
                          <span className="text-muted-foreground">
                            ({provider.review_count || 0} avaliações)
                          </span>
                        </div>

                        {(profile?.city || profile?.neighborhood) && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {profile?.neighborhood && `${profile.neighborhood}, `}
                              {profile?.city}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sobre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {provider.description || "Sem descrição disponível."}
                  </p>
                </CardContent>
              </Card>

              {/* Services */}
              {provider.services && provider.services.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Serviços Oferecidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {provider.services.map((service: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Work Photos Gallery */}
              {workPhotos && workPhotos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📸 Galeria de Trabalhos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {workPhotos.map((photo: any) => (
                        <div key={photo.id} className="rounded-lg overflow-hidden aspect-square">
                          <img src={photo.url} alt="Trabalho realizado" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{provider.completed_jobs || 0}</p>
                    <p className="text-xs text-muted-foreground">Trabalhos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{provider.years_experience || 0}</p>
                    <p className="text-xs text-muted-foreground">Anos Exp.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 text-warning mx-auto mb-2" />
                    <p className="text-2xl font-bold">{provider.rating?.toFixed(1) || "0.0"}</p>
                    <p className="text-xs text-muted-foreground">Avaliação</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{provider.review_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Avaliações</p>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Avaliações de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.profiles?.avatar_url || ""} />
                              <AvatarFallback>
                                {review.profiles?.full_name?.charAt(0) || "C"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {review.profiles?.full_name || "Cliente"}
                                </span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? "text-warning fill-warning"
                                          : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {review.comment || "Sem comentário"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(review.created_at).toLocaleDateString("pt-MZ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Este profissional ainda não tem avaliações.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Contactar Profissional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {provider.price_range && (
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Faixa de preço</p>
                      <p className="font-semibold text-lg">{provider.price_range}</p>
                    </div>
                  )}

                  <Button asChild className="w-full" size="lg">
                    <Link to={`/solicitar-servico/${id}`}>
                      <Send className="w-4 h-4 mr-2" />
                      Solicitar Serviço
                    </Link>
                  </Button>

                  <Button onClick={handleWhatsApp} className="w-full" variant="default">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>

                  {profile?.phone && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={`tel:+258${profile.phone.replace(/\D/g, "")}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar
                      </a>
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    A plataforma apenas conecta clientes e profissionais. 
                    O pagamento é feito diretamente entre as partes.
                  </p>
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