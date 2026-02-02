import React from "react";
import { Container } from "@/components/Container";
import { getAllCategories } from "@/lib/api";
import { CategoryCard } from "@/components/CategoryCard";

export default async function CatalogoPage() {
    const categories = await getAllCategories();

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#8a1c1c' }}>
            <Container className="py-20">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">
                        Catálogo de Soluciones
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto">
                        Explore nuestra gama completa de equipamiento profesional Launch.
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>
            </Container>
        </div>
    );
}
