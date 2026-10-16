import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

export default function ProviderRegistration() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    description: "",
    services: "",
    priceRange: "",
    yearsExperience: "",
    city: "",
    neighborhood: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Precisa fazer login primeiro");
      navigate("/auth?type=provider");
      return;
    }

    if (!formData.categoryId || !formData.description) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update profile with city and neighborhood
      if (formData.city || formData.neighborhood) {
        await supabase
          .from("profiles")
          .update({
            city: formData.city,
            neighborhood: formData.neighborhood,
            user_type: "provider"
          })
          .eq("user_id", user.id);
      }

      // Create provider profile
      const servicesArray = formData.services
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const { error } = await supabase
        .from("provider_profiles")
        .insert({
          user_id: user.id,
          category_id: formData.categoryId,
          description: formData.description,
          services: servicesArray,
          price_range: formData.priceRange,
          years_experience: parseInt(formData.yearsExperience) || 0
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("Você já possui um perfil de profissional cadastrado");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Cadastro enviado com sucesso! Aguarde a aprovação.");
      navigate("/");
    } catch (error: any) {
      console.error("Error creating provider profile:", error);
      toast.error("Erro ao criar perfil. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container-app max-w-lg">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Criar Conta de Profissional</CardTitle>
                <CardDescription>
                  Para se cadastrar como profissional, primeiro crie uma conta ou faça login.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <a href="/auth?type=provider">
                    Criar Conta
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Já tem conta?{" "}
                  <a href="/auth" className="text-primary hover:underline">
                    Entrar
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container-app max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Cadastro de Profissional</h1>
            <p className="text-muted-foreground">
              Complete seu perfil para começar a receber pedidos de clientes
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Categoria de Serviço <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Escolha a categoria principal dos seus serviços
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descrição Profissional <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva sua experiência, especialidades e o que oferece aos clientes..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Uma boa descrição aumenta suas chances de receber pedidos
                  </p>
                </div>

                {/* Services */}
                <div className="space-y-2">
                  <Label htmlFor="services">Serviços Oferecidos</Label>
                  <Input
                    id="services"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    placeholder="Ex: Instalação elétrica, Reparação de tomadas, Manutenção"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separe os serviços por vírgula
                  </p>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ex: Maputo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="Ex: Polana"
                    />
                  </div>
                </div>

                {/* Experience and Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Anos de Experiência</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      placeholder="Ex: 5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Faixa de Preço</Label>
                    <Input
                      id="priceRange"
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                      placeholder="Ex: 500 - 2.000 MZN"
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Após o cadastro:</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Seu perfil será analisado pela nossa equipa</li>
                      <li>• Você receberá uma notificação quando for aprovado</li>
                      <li>• Clientes poderão encontrá-lo na plataforma</li>
                    </ul>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Cadastro
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}