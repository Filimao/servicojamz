import type { Category } from "../hooks/useCategories";
import type { ProviderWithProfile } from "../hooks/useProviders";

const demoProviderSeeds = [
  {
    id: "electrician",
    categoryKeywords: ["eletric", "electric"],
    name: "Exemplo de eletricista",
    city: "Maputo",
    neighborhood: "Maxaquene",
    description: "Exemplo de perfil para instalações domésticas, iluminação e pequenas reparações elétricas.",
    services: ["Instalação de tomadas", "Iluminação", "Diagnóstico elétrico"],
  },
  {
    id: "plumber",
    categoryKeywords: ["canal", "plumb"],
    name: "Exemplo de canalizador",
    city: "Matola",
    neighborhood: "Liberdade",
    description: "Exemplo de perfil para fugas de água, torneiras, canalização e manutenção doméstica.",
    services: ["Reparação de fugas", "Torneiras", "Canalização doméstica"],
  },
  {
    id: "mason",
    categoryKeywords: ["pedre", "constru", "mason"],
    name: "Exemplo de pedreiro",
    city: "Beira",
    neighborhood: "Ponta-Gêa",
    description: "Exemplo de perfil para pequenas obras, alvenaria e reparações de paredes e pavimentos.",
    services: ["Alvenaria", "Reboco", "Reparação de pavimentos"],
  },
  {
    id: "technician",
    categoryKeywords: ["técnic", "tecnic", "internet", "tv"],
    name: "Exemplo de técnico de redes",
    city: "Nampula",
    neighborhood: "Muhala",
    description: "Exemplo de perfil para configuração de internet, routers e instalação de antenas e televisores.",
    services: ["Configuração de router", "Antenas", "Instalação de TV"],
  },
  {
    id: "beauty",
    categoryKeywords: ["cabeleir", "beleza", "hair"],
    name: "Exemplo de cabeleireira",
    city: "Quelimane",
    neighborhood: "Coalane",
    description: "Exemplo de perfil para tranças, penteados e cuidados capilares, com atendimento combinado previamente.",
    services: ["Tranças", "Penteados", "Cuidados capilares"],
  },
  {
    id: "mechanic",
    categoryKeywords: ["mecânic", "mecanic", "mechanic"],
    name: "Exemplo de mecânico",
    city: "Tete",
    neighborhood: "Matundo",
    description: "Exemplo de perfil para manutenção automóvel e diagnóstico de problemas mecânicos comuns.",
    services: ["Manutenção automóvel", "Diagnóstico", "Travões"],
  },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function createDemoProviders(categories: Category[]): ProviderWithProfile[] {
  return demoProviderSeeds.flatMap((seed) => {
    const category = categories.find((item) => {
      const categoryName = normalize(item.name);
      const categorySlug = normalize(item.slug);
      return seed.categoryKeywords.some((keyword) => {
        const normalizedKeyword = normalize(keyword);
        return categoryName.includes(normalizedKeyword) || categorySlug.includes(normalizedKeyword);
      });
    });

    if (!category) return [];

    const id = `demo-${seed.id}`;
    return [{
      id,
      user_id: id,
      category_id: category.id,
      description: seed.description,
      services: seed.services,
      price_range: null,
      years_experience: 0,
      is_verified: false,
      is_premium: false,
      rating: 0,
      review_count: 0,
      completed_jobs: 0,
      profile: {
        full_name: seed.name,
        avatar_url: null,
        city: seed.city,
        neighborhood: seed.neighborhood,
        phone: null,
      },
      category: {
        name: category.name,
        icon: category.icon,
      },
      is_demo: true,
    }];
  });
}