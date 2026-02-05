import { Search, User, MessageSquare, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Pesquise",
    description: "Escolha o serviço que precisa e a sua localização",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: User,
    title: "Escolha",
    description: "Compare perfis, avaliações e preços dos profissionais",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: MessageSquare,
    title: "Contacte",
    description: "Entre em contacto direto com o profissional escolhido",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Star,
    title: "Avalie",
    description: "Após o serviço, deixe sua avaliação para ajudar outros",
    color: "bg-warning/20 text-warning",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Como Funciona</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Encontrar um profissional nunca foi tão fácil. Siga estes passos simples.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Step Number */}
              <div className="relative inline-block mb-6">
                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
