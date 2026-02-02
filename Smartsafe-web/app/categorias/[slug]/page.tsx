import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import { ProductList } from "@/components/ProductList";
import { Container } from "@/components/Container";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ChevronRight } from "lucide-react";
import { getCategoryColor } from "@/lib/categoryColors";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const getTemplateConfig = (template: string = 'default') => {
    switch (template) {
        case 'scanner-pro':
        case 'specialized-diagnostic':
            return {
                gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                cardStyle: 'aspect-[16/9]',
                showFilters: true
            };
        case 'equipment':
        case 'elevators':
        case 'tool-storage':
            return {
                gridCols: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
                cardStyle: 'aspect-[4/3]',
                showFilters: true
            };
        case 'accessory':
        case 'tpms':
            return {
                gridCols: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
                cardStyle: 'aspect-square',
                showFilters: false
            };
        default:
            return {
                gridCols: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
                cardStyle: 'aspect-[4/3]',
                showFilters: true
            };
    }
};

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category || !category.isActive) {
        notFound();
    }

    const products = await getProductsByCategory(slug);

    // Theme Override: Green for EV, Default Red for others
    const headerBgColor = slug === 'herramientas-ev' ? '#1ea33c' : '#8a1c1c';

    const config = getTemplateConfig(category.template || 'default');

    // Hero Images Logic: Previews (Products) -> Carousel Folder -> Single Cover
    const heroImages = category.previews && category.previews.length > 0
        ? category.previews
        : category.carrouselImages && category.carrouselImages.length > 0
            ? category.carrouselImages
            : category.image ? [category.image] : [];

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header Section */}
            <div
                className="relative overflow-hidden pb-24 pt-20"
                style={{ backgroundColor: headerBgColor }}
            >
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                <Container className="relative z-10">
                    <div className="mb-8 flex items-center gap-2 text-sm font-medium text-white/60">
                        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                        <ChevronRight size={14} />
                        <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
                        <ChevronRight size={14} />
                        <span className="text-white">{category.title}</span>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h1 className="mb-6 text-5xl font-bold leading-tight text-white font-[family-name:var(--font-space-grotesk)]">
                                {category.title}
                            </h1>
                            <p className="text-lg leading-relaxed text-white/80">
                                {category.shortDescription}
                            </p>

                            {/* Optional Tags */}
                            {category.tags && (
                                <div className="mt-8 flex flex-wrap gap-2">
                                    {category.tags.map(tag => (
                                        <span key={tag} className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/80 uppercase tracking-wider backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hero Carousel */}
                        <div className="relative aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl">
                            <HeroCarousel images={heroImages} alt={category.title} variant="compact" />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Products Grid - Removed negative margin for cleaner flow */}
            <div className="pb-24 relative z-20">
                <Container className="py-12">
                    <ProductList initialProducts={products} gridClassName={config.gridCols} />
                </Container>
            </div>
        </div>
    );
}
