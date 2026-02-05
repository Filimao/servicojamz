import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { categories, cities } from "@/data/mockData";

export function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background py-12 sm:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-app relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span>🇲🇿</span>
            <span>O marketplace de serviços de Moçambique</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up leading-tight">
            Encontre profissionais{" "}
            <span className="text-gradient">de confiança</span>{" "}
            perto de si
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 animate-slide-up delay-100 max-w-2xl mx-auto">
            Conectamos você aos melhores eletricistas, canalizadores, pedreiros 
            e outros profissionais verificados em Moçambique.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-4 shadow-xl border border-border animate-slide-up delay-200">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category Select */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                >
                  <option value="">Que serviço precisa?</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Select */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                >
                  <option value="">Onde está?</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <Button variant="hero" size="lg" className="h-12 px-8">
                Buscar
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground animate-fade-in delay-300">
            <div className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>Profissionais verificados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>Avaliações reais</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>100% gratuito</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
