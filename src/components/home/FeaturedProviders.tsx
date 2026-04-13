import { useProviders } from "@/hooks/useProviders";
import { ProviderCardDB } from "@/components/providers/ProviderCardDB";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function FeaturedProviders() {
  const { data: providers, isLoading } = useProviders({});
  const featuredProviders = (providers || []).slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container-app flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (featuredProviders.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container-app">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="section-title mb-3">Profissionais em Destaque</h2>
            <p className="section-subtitle">
              Os melhores avaliados da nossa plataforma
            </p>
          </div>
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Ver todos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProviders.map((provider, index) => (
            <div
              key={provider.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ProviderCardDB provider={provider} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
