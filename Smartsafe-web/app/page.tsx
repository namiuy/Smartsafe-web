import Link from "next/link";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TargetAudience } from "@/components/home/TargetAudience";
import { SoftCTA } from "@/components/home/SoftCTA";
import { getFeaturedProducts, getAllCategories } from "@/lib/api";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getAllCategories();

  // Force-refresh: Product List Update
  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50">

      {/* 1. Hero Section */}
      <HeroCarousel products={featuredProducts} enableSmartScaling={true} />

      {/* 2. Categories Grid */}
      <CategoryGrid categories={categories} />

      {/* 3. Featured Products Section */}
      <section className="py-12 bg-[#8a1c1c] text-white">
        <Container>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                Productos Destacados
              </h2>
              <p className="text-white/80 mt-2">
                Nuestra selección de equipos más demandados.
              </p>
            </div>

            {/* Link removed as per user request */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-zinc-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p>No hay productos destacados por el momento.</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 4. Why Choose Launch */}
      <WhyChooseUs />

      {/* 5. Target Audience */}
      <TargetAudience />

      {/* 6. Soft CTA */}
      <SoftCTA />

    </div>
  );
}
