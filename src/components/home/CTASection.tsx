import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 sm:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-background rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-background rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 text-background text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                <span>Para Profissionais</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-background mb-4">
                É profissional? Junte-se a nós!
              </h2>
              <p className="text-lg text-background/90 mb-8 max-w-xl">
                Cadastre-se gratuitamente e comece a receber pedidos de clientes 
                na sua região. Aumente sua visibilidade e faça crescer o seu negócio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="bg-background text-primary hover:bg-background/90"
                >
                  Cadastrar como Profissional
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-background text-background hover:bg-background/10"
                >
                  Saber mais
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-background mb-2">
                  500+
                </div>
                <div className="text-background/80">Profissionais</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-background mb-2">
                  2,000+
                </div>
                <div className="text-background/80">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-background mb-2">
                  4.8
                </div>
                <div className="text-background/80">Avaliação média</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
