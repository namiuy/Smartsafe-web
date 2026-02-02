import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api";
import { Container } from "@/components/Container";
import { ConsultationSection } from "@/components/ConsultationSection";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductSections } from "@/components/ProductSections";
import { Check, ChevronRight, FileText, Download } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug('accesorios', slug);
    if (!product) return {};
    return {
        title: product.seo?.title || product.title,
        description: product.seo?.description || product.shortDescription,
    };
}

export default async function AccessoryProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug('accesorios', slug);

    if (!product) {
        notFound();
    }

    // Determine correct image source (gallery folder or single image)
    const images = product.galleryImages || (product.image ? [product.image] : []);

    return (
        <div className="min-h-screen bg-zinc-950 font-sans">
            {/* Header / Breadcrumb */}
            <div className="border-b border-white/5 bg-zinc-900/50 backdrop-blur-md sticky top-14 z-40">
                <Container>
                    <div className="flex items-center gap-2 py-4 text-sm text-zinc-400">
                        <Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link>
                        <ChevronRight size={14} />
                        <Link href="/catalogo/accesorios" className="hover:text-white transition-colors">Accesorios</Link>
                        <ChevronRight size={14} />
                        <span className="text-white truncate max-w-[200px]">{product.title}</span>
                    </div>
                </Container>
            </div>

            {/* Hero Section */}
            <div className="relative pt-12 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />

                <Container>
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Gallery */}
                        <div>
                            <ProductGallery images={images} title={product.title} />
                        </div>

                        {/* Right: Info */}
                        <div className="space-y-8">
                            <div>
                                {product.badge && (
                                    <span className="inline-block bg-[#C40000] text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wider">
                                        {product.badge}
                                    </span>
                                )}
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)]">
                                    {product.title}
                                </h1>
                                <p className="text-xl text-zinc-300 leading-relaxed">
                                    {product.shortDescription}
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                                {product.purchase?.url && product.purchase.url !== "#" && (
                                    <a
                                        href={product.purchase.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-[#C40000] hover:bg-[#a00000] text-white text-center font-bold py-4 rounded-full transition-all shadow-lg shadow-red-900/20"
                                    >
                                        {product.purchase.label || "Comprar"}
                                    </a>
                                )}
                                <a
                                    href="#consultar"
                                    className={`flex-1 border border-white/20 hover:bg-white/10 text-white text-center font-bold py-4 rounded-full transition-all ${(!product.purchase?.url || product.purchase.url === "#") ? 'bg-white text-zinc-950 hover:bg-zinc-200 border-transparent' : ''}`}
                                >
                                    Consultar Disponibilidad
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Sections */}
            <ProductSections sections={product.sections} />

            {/* Consultation (Always present) */}
            <div id="consultar" className="scroll-mt-24">
                <ConsultationSection consultation={product.consultation} />
            </div>
        </div>
    );
}
