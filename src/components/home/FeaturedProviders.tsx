import { ProviderCardDB } from "@/components/providers/ProviderCardDB";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { createDemoProviders } from "@/data/demoProviders";
import { useProviders } from "@/hooks/useProviders";
import { categories as localCategories } from "@/data/mockData";

export function FeaturedProviders() {
  const { data: categories } = useCategories();
  const { data: providers, isError: providersError } = useProviders({});
  const categoryFallback = [
    ...localCategories.map((category) => ({
      id: category.id,
      slug: category.id,
      name: category.name,
      icon: category.icon,
      description: category.description,
      is_active: true,
    })),
    { id: "mechanic", slug: "mecanico", name: "Mecânico", icon: "wrench", description: null, is_active: true },
  ];
  const demoProviders = createDemoProviders(categories?.length ? categories : categoryFallback);
  const registeredProvider = [...(providers || [])]
    .filter((provider) => !providersError &&
      provider.profile?.full_name?.trim() &&
      provider.profile?.city?.trim() &&
      provider.category?.name?.trim() &&
      (provider.description?.trim().length || 0) >= 20 &&
      provider.services?.length > 0
    )
    .sort((a, b) => {
      const completeness = (provider: typeof a) =>
        Number(!!provider.profile.neighborhood) +
        Number(!!provider.profile.phone) +
        Math.min(provider.services.length, 3) +
        Math.min(provider.description?.trim().length || 0, 120) / 120;
      return completeness(b) - completeness(a);
    })[0];
  const featuredProviders = [
    ...(registeredProvider ? [{ ...registeredProvider, is_registered: true }] : []),
    ...demoProviders
      .filter((provider) => provider.category_id !== registeredProvider?.category_id)
      .slice(0, registeredProvider ? 5 : 6),
  ];

  if (featuredProviders.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container-app">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="section-title mb-3">Prestadores e exemplos locais</h2>
            <p className="section-subtitle max-w-2xl">
              {registeredProvider
                ? "Inclui um perfil aprovado, com dados do próprio cadastro, e exemplos ilustrativos que não representam pessoas reais."
                : "Exemplos ilustrativos com serviços e zonas de referência. Não representam pessoas reais; encontre prestadores disponíveis na busca."}
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
