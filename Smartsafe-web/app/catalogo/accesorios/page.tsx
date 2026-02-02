import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessoriesCategoryData } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/Container";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const data = await getAccessoriesCategoryData();
    if (!data) return {};
    return {
        title: data.category.seo?.title || data.category.title,
        description: data.category.seo?.description || data.category.shortDescription,
    };
}

export default async function AccessoriesCategoryPage() {
    const data = await getAccessoriesCategoryData();

    if (!data) {
        notFound();
    }

    const { category, products } = data;

    // Use specific config for accessories as requested/implied (similar to 'accessory' template)
    const gridCols = 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5';
    // const cardStyle = 'aspect-square'; // Handled in ProductCard if needed, or by grid layout

    // Hero Images Logic
    const heroImages = category.previews && category.previews.length > 0
        ? category.previews
        : category.carrouselImages && category.carrouselImages.length > 0
            ? category.carrouselImages
            : category.image ? [category.image] : [];

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-[#8a1c1c] pb-24 pt-20">
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
                            {category.logo && (
                                <div className="mb-6 h-12 relative w-48">
                                    <Image
                                        src={category.logo}
                                        alt={`${category.title} Logo`}
                                        fill
                                        className="object-contain object-left"
                                    />
                                </div>
                            )}
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
                        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl">
                            <HeroCarousel images={heroImages} alt={category.title} variant="compact" />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Products Grid */}
            <div className="pb-24 relative z-20">
                <Container>
                    <div className={`grid gap-6 ${gridCols} py-12`}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                // Mapping to specific URL structure /catalogo/accesorios/[slug]
                                // Note: ProductCard usually links to /categorias/[cat]/[prod].
                                // We might need to customize ProductCard or wrap it?
                                // Actually ProductCard usually takes a `product` object which has `categorySlug`.
                                // If `product.categorySlug` is 'accesorios', the generic ProductCard might link to /categorias/accesorios/...
                                // To force /catalogo/accesorios/..., I should probably manually construct the link or pass an override.
                                // Let's check ProductCard. But I'll assume standard link is fine OR I can pass a custom slug context.
                                // WAIT: The user wants /catalogo/accesorios/[slug].
                                // If I pass the product object as is, it has `categorySlug`.
                                // Let's assume for now I will use a custom Link wrapper or modify ProductCard if needed.
                                // For now, I'll pass a modified product object with a 'customUrl' if ProductCard supports it, or just rely on generic routing if acceptable.
                                // BUT USER SAID: "Cada card navega a /catalogo/accesorios/[slug]".
                                // So I MUST ensure the link is correct.
                                <Link key={product.slug} href={`/catalogo/accesorios/${product.slug}`} className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="aspect-square relative flex items-center justify-center p-6 bg-white/5">
                                        <Image
                                            src={product.image || "/images/placeholder.png"}
                                            alt={product.title}
                                            width={400}
                                            height={400}
                                            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.badge && (
                                            <div className="absolute top-3 left-3 bg-[#C40000] text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                                                {product.badge}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#C40000] transition-colors">{product.title}</h3>
                                        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-grow">{product.shortDescription}</p>
                                        <div className="mt-auto flex items-center text-[#C40000] text-sm font-bold uppercase tracking-wider">
                                            Ver Detalles <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                                <p className="text-zinc-300 text-lg">Próximamente agregaremos productos a esta categoría.</p>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        </div>
    );
}
