import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Users, 
  Star, 
  TrendingUp, 
  Shield, 
  Smartphone,
  ArrowRight,
  Zap,
  Crown,
  Briefcase
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Receba pedidos de clientes perto de si",
    description: "Clientes da sua cidade encontram você facilmente"
  },
  {
    icon: Smartphone,
    title: "Perfil profissional na internet",
    description: "Mostre seus serviços, fotos e avaliações"
  },
  {
    icon: Star,
    title: "Construa reputação com avaliações",
    description: "Avaliações reais aumentam sua credibilidade"
  },
  {
    icon: TrendingUp,
    title: "Trabalhe sem intermediários",
    description: "Negocie diretamente com seus clientes"
  },
  {
    icon: Shield,
    title: "Aumente sua visibilidade",
    description: "Apareça para milhares de clientes potenciais"
  },
  {
    icon: Zap,
    title: "Plataforma simples e fácil",
    description: "Fácil de usar, mesmo sem experiência digital"
  }
];

const steps = [
  {
    number: "1",
    title: "Cadastre-se gratuitamente",
    description: "Crie sua conta em menos de 2 minutos"
  },
  {
    number: "2",
    title: "Crie seu perfil profissional",
    description: "Adicione fotos, serviços e descrição"
  },
  {
    number: "3",
    title: "Receba pedidos e trabalhe",
    description: "Clientes entram em contacto diretamente"
  }
];

const plans = [
  {
    name: "Gratuito",
    price: "0",
    period: "mês",
    description: "Ideal para começar",
    icon: Zap,
    features: [
      "Perfil básico",
      "Até 5 pedidos por mês",
      "Aparece nos resultados padrão",
      "Avaliações públicas"
    ],
    buttonText: "Começar Grátis",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Premium",
    price: "1.200",
    period: "mês",
    description: "Mais visibilidade = mais clientes",
    icon: Star,
    features: [
      "Pedidos ilimitados",
      "Destaque nos resultados",
      "Selo \"Profissional Verificado\"",
      "Prioridade no ranking",
      "Suporte prioritário"
    ],
    buttonText: "Tornar-se Premium",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Premium Pro",
    price: "2.000",
    period: "mês",
    description: "Para profissionais que querem crescer",
    icon: Crown,
    features: [
      "Tudo do Premium",
      "Destaque máximo na sua cidade",
      "Perfil em destaque na home",
      "Estatísticas avançadas",
      "Acesso antecipado a novidades"
    ],
    buttonText: "Escolher Pro",
    buttonVariant: "secondary" as const,
    popular: false
  }
];

export default function ForProfessionals() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 sm:py-24">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
          </div>

          <div className="container-app relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Briefcase className="w-4 h-4 mr-2" /> Para Profissionais
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Ganhe mais clientes e aumente sua renda com o{" "}
                <span className="text-primary">ServiçoJá</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Conectamos profissionais locais a clientes reais, todos os dias, em Moçambique.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="hero" size="xl">
                  <Link to="/cadastro-profissional">
                    Cadastrar-me como profissional
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Comece grátis. Atualize para Premium quando quiser.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="py-16 sm:py-20 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="section-title mb-3">Por que se cadastrar no ServiçoJá?</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Se você é eletricista, canalizador, pedreiro, técnico ou outro profissional, 
                o ServiçoJá ajuda você a crescer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="section-title mb-3">Como funciona</h2>
              <p className="section-subtitle">3 passos simples para começar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="planos" className="py-16 sm:py-20 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="section-title mb-3">Planos e Preços</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Escolha o plano ideal para o seu negócio. Todos os preços em Meticais (MZN).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border shadow-md'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground"> MZN/{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      asChild 
                      variant={plan.buttonVariant} 
                      className="w-full"
                    >
                      <Link to="/cadastro-profissional">
                        {plan.buttonText}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="container-app">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 sm:p-12 text-center text-primary-foreground">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Pronto para aumentar sua renda?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Milhares de clientes em Moçambique estão procurando profissionais como você. 
                Cadastre-se agora e comece a receber pedidos.
              </p>
              <Button asChild variant="secondary" size="xl">
                <Link to="/cadastro-profissional">
                  Cadastrar-me Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}