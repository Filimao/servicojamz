import { useCategories } from "@/hooks/useCategories";
import { useProviders } from "@/hooks/useProviders";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Categorias de Serviços</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Escolha a categoria e encontre profissionais qualificados na sua região
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories?.map((category, index) => (
            <Link
              key={category.id}
              to={`/services?category=${category.id}`}
              className="group card-interactive p-6 text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Ver todas as categorias
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
