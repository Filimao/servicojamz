import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ArrowRight, ShieldCheck, Star, Zap } from "lucide-react";
import { cities } from "@/data/mockData";
import { useCategories } from "@/hooks/useCategories";
import heroImage from "@/assets/hero-professional.jpg";

export function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  const { data: categories } = useCategories();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedCity) params.set("city", selectedCity);
    navigate(`/services${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Profissional moçambicano trabalhando"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40" />
      </div>

      <div className="container-app relative py-12 sm:py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-semibold mb-6 animate-fade-in shadow-lg">
            <span>🇲🇿</span>
            <span>Marketplace #1 de Moçambique</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 animate-slide-up leading-tight">
            Encontre profissionais{" "}
            <span className="text-accent">confiáveis</span>{" "}
            perto de si
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-background/90 mb-8 animate-slide-up delay-100 max-w-xl">
            Eletricistas, canalizadores, pedreiros e técnicos verificados em Maputo, Matola e todo Moçambique.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-4 shadow-2xl border border-border animate-slide-up delay-200">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                {/* Category Select */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="">Que serviço precisa?</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Select */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="">Onde está?</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <Button variant="default" size="lg" className="h-14 min-h-[48px] text-base font-bold" onClick={handleSearch}>
                Buscar agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 text-sm text-background animate-fade-in delay-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span className="font-medium">Verificados</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="font-medium">Avaliações reais</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-medium">Rápido e seguro</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
