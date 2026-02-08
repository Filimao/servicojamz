import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  User, 
  MessageSquare, 
  Star,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock
} from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Pesquise o Serviço",
    description: "Escolha a categoria do serviço que precisa e a sua localização. Temos eletricistas, canalizadores, pedreiros, técnicos e muito mais.",
    color: "bg-primary"
  },
  {
    number: "2",
    icon: User,
    title: "Escolha o Profissional",
    description: "Compare perfis, avaliações, preços e experiência. Escolha o profissional que melhor atende às suas necessidades.",
    color: "bg-secondary"
  },
  {
    number: "3",
    icon: MessageSquare,
    title: "Solicite e Combine",
    description: "Entre em contacto diretamente com o profissional pelo WhatsApp ou telefone. Combine o serviço, data e preço.",
    color: "bg-accent"
  },
  {
    number: "4",
    icon: Star,
    title: "Avalie o Serviço",
    description: "Após a conclusão do trabalho, deixe sua avaliação para ajudar outros clientes a escolherem melhor.",
    color: "bg-warning"
  }
];

const benefits = [
  {
    icon: CheckCircle,
    title: "100% Gratuito para Clientes",
    description: "Usar a plataforma é totalmente gratuito. Você só paga pelo serviço contratado."
  },
  {
    icon: Shield,
    title: "Profissionais Verificados",
    description: "Verificamos o telefone e dados de cada profissional para sua segurança."
  },
  {
    icon: Star,
    title: "Avaliações Reais",
    description: "Avaliações de clientes reais ajudam você a escolher o melhor profissional."
  },
  {
    icon: Clock,
    title: "Rápido e Simples",
    description: "Encontre um profissional em poucos minutos, sem complicações."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 sm:py-20">
          <div className="container-app text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Como Funciona o ServiçoJá
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontrar um profissional de confiança nunca foi tão fácil. 
              Siga estes passos simples e resolva o que precisa.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 sm:py-20">
          <div className="container-app">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`flex flex-col md:flex-row gap-6 items-center ${
                    index < steps.length - 1 ? 'mb-12 pb-12 border-b' : ''
                  }`}
                >
                  <div className={`w-20 h-20 rounded-2xl ${step.color} text-white flex items-center justify-center shrink-0`}>
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Passo {step.number}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="section-title mb-3">Por que usar o ServiçoJá?</h2>
              <p className="section-subtitle">
                Vantagens que fazem a diferença
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20">
          <div className="container-app">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 sm:p-12 text-center text-primary-foreground">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Pronto para encontrar um profissional?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Milhares de profissionais verificados estão prontos para ajudá-lo. 
                Comece sua busca agora mesmo!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="secondary" size="lg">
                  <Link to="/services">
                    Buscar Profissionais
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/para-profissionais">
                    Sou Profissional
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}