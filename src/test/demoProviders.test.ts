import { describe, expect, it } from "vitest";
import { createDemoProviders } from "../data/demoProviders";

describe("createDemoProviders", () => {
  it("creates clearly marked profiles only for available categories", () => {
    const providers = createDemoProviders([
      { id: "category-electric", slug: "eletricista", name: "Eletricista", icon: "zap", description: null, is_active: true },
      { id: "category-plumber", slug: "canalizador", name: "Canalizador", icon: "wrench", description: null, is_active: true },
    ]);

    expect(providers).toHaveLength(2);
    expect(providers.every((provider) => provider.is_demo)).toBe(true);
    expect(providers.every((provider) => provider.profile.phone === null)).toBe(true);
    expect(providers.map((provider) => provider.profile.city)).toEqual(["Maputo", "Matola"]);
    expect(providers.every((provider) => provider.profile.neighborhood !== null)).toBe(true);
    expect(providers.every((provider) => provider.review_count === 0)).toBe(true);
    expect(providers.every((provider) => provider.price_range === null)).toBe(true);
  });

  it("returns no demo profiles when no service categories exist", () => {
    expect(createDemoProviders([])).toEqual([]);
  });
});