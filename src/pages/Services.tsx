import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useCategories";
import { useProviders, ProviderWithProfile } from "@/hooks/useProviders";
import { Search, MapPin, Star, Filter, X, Loader2 } from "lucide-react";
import { cities } from "@/data/mockData";
import { ProviderCardDB } from "@/components/providers/ProviderCardDB";

export default function Services() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialCity = searchParams.get("city") || "";

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: providers, isLoading: providersLoading } = useProviders({
    categoryId: selectedCategory || undefined,
    city: selectedCity || undefined,
    minRating: minRating || undefined,
    searchQuery: searchQuery || undefined,
  });

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedCity("");
    setMinRating(0);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory || selectedCity || minRating > 0 || searchQuery;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-muted/30 to-background py-8 sm:py-12">
          <div className="container-app">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Encontre Profissionais
            </h1>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Pesquise por categoria, localização ou avaliação e encontre o profissional ideal para o seu serviço.
            </p>

            {/* Search Bar */}
            <div className="bg-card rounded-2xl p-4 shadow-lg border border-border">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Pesquisar profissionais..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-xl"
                  />
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 gap-2"
                >
                  <Filter className="w-5 h-5" />
                  Filtros
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-border animate-slide-up">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Categoria
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Todas as categorias</option>
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Cidade
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="">Todas as cidades</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Avaliação mínima
                      </label>
                      <div className="relative">
                        <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warning" />
                        <select
                          value={minRating}
                          onChange={(e) => setMinRating(Number(e.target.value))}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value={0}>Qualquer avaliação</option>
                          <option value={3}>3+ estrelas</option>
                          <option value={4}>4+ estrelas</option>
                          <option value={4.5}>4.5+ estrelas</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Limpar filtros
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Categories Quick Filter */}
        <section className="py-6 border-b border-border">
          <div className="container-app">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
                className="flex-shrink-0"
              >
                Todos
              </Button>
              {categories?.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex-shrink-0 gap-2"
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8 sm:py-12">
          <div className="container-app">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {providersLoading ? (
                  "Carregando..."
                ) : (
                  <>
                    {providers?.length || 0} profissional
                    {providers?.length !== 1 ? "is" : ""} encontrado
                    {providers?.length !== 1 ? "s" : ""}
                  </>
                )}
              </h2>
            </div>

            {/* Loading State */}
            {providersLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Empty State */}
            {!providersLoading && providers?.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum profissional encontrado
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Tente ajustar os filtros ou pesquisar por outros termos para encontrar profissionais disponíveis.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            )}

            {/* Providers Grid */}
            {!providersLoading && providers && providers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider, index) => (
                  <div
                    key={provider.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProviderCardDB provider={provider} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
