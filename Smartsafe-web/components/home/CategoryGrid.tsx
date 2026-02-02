"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";
import { Container } from "@/components/Container";
import { CategoryCard } from "@/components/CategoryCard";

interface CategoryGridProps {
    categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
    return (
        <section className="py-12 bg-[#8a1c1c]">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">
                        Soluciones por Categoría
                    </h2>
                    <p className="text-zinc-200">
                        Equipamiento especializado para cada necesidad de su taller.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(0, 6).map((category) => (
                        <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/catalogo" className="text-sm font-semibold text-white/80 hover:text-white transition-colors uppercase tracking-wide border-b border-white/20 hover:border-white pb-0.5">
                        Ver Catálogo
                    </Link>
                </div>
            </Container>
        </section>
    );
}
