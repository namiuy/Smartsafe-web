import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getCategoryBySlug } from "@/lib/api";
import { ProductSections } from "@/components/ProductSections";
import { ProductGallery } from "@/components/ProductGallery";
import { Container } from "@/components/Container";
import { ProductCTA } from "@/components/ProductCTA"; // New Import

import { hasValidUrl } from "@/lib/utils";
import { ArrowLeft, MessageCircle, MapPin, Phone, ShieldCheck } from "lucide-react";


interface PageProps {
    params: Promise<{
        slug: string;
        productSlug: string;
    }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { slug, productSlug } = await params;
    const product = await getProductBySlug(slug, productSlug);
    const category = await getCategoryBySlug(slug);

    if (!product || !product.isActive) {
        notFound();
    }

    // Default CTA messages
    const whatsappMessage = product.cta?.whatsappText
        ? encodeURIComponent(product.cta.whatsappText)
        : encodeURIComponent(`Hola, me interesa el ${product.title}`);

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Navigation Bar (Static) */}
            <div className="border-b border-white/5 bg-zinc-950 relative z-10">
                <Container className="flex items-center justify-between py-4">
                    <Link
                        href={`/categorias/${slug}`}
                        className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Volver a {category?.title || product.categorySlug}</span>
                    </Link>
                </Container>
            </div>


            <section className="relative py-6 md:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[#8a1c1c]/10 pointer-events-none" />
                <div className="absolute top-0 right-0 p-20 opacity-20 bg-[url('/grid.svg')] [mask-image:radial-gradient(circle,white,transparent)] pointer-events-none" />

                <Container className="relative z-10">
                    <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            {/* Badge */}
                            {product.badge && (
                                <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-[#C40000] text-white text-xs md:text-sm font-bold mb-3 md:mb-6 shadow-lg shadow-[#C40000]/20 max-w-full truncate">
                                    {product.badge}
                                </span>
                            )}

                            <h1 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-6 font-[family-name:var(--font-space-grotesk)] leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-base md:text-xl text-zinc-300 leading-relaxed mb-4 md:mb-8 max-w-xl line-clamp-4 md:line-clamp-none">
                                {product.shortDescription}
                            </p>

                            <div className="mt-4 md:mt-8 w-full">
                                <ProductCTA
                                    purchaseUrl={product.purchase?.url}
                                    productTitle={product.title}
                                    categorySlug={slug}
                                    consultationData={product.consultation}
                                    ctaPrimaryLabel={product.cta?.primaryLabel}
                                    ctaWhatsappText={product.cta?.whatsappText}
                                    ctaSecondaryLabel={product.cta?.secondaryLabel}
                                />
                            </div>
                        </div>

                        {/* Image Gallery / Cover */}
                        <div className="order-1 lg:order-2 relative w-full">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#C40000]/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none" />
                            <div className="relative z-10">
                                <ProductGallery
                                    images={product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : [product.image || "/images/placeholder.png"]}
                                    title={product.title}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* DYNAMIC SECTIONS RENDERER */}
            <section id="specifications" className="py-20 bg-zinc-900/50">
                <Container>
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content (Sections) */}
                        <div className="lg:col-span-2">
                            <ProductSections sections={product.sections} />
                        </div>

                        {/* Sidebar: Consultation & Coverage */}
                        <div className="space-y-8">
                            {/* Consultation Box (Quick View) */}
                            <div id="consultar" className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
                                    {product.consultation.title}
                                </h3>
                                <p className="text-zinc-400 text-sm mb-6">
                                    {product.consultation.description}
                                </p>

                                <div className="space-y-6">
                                    {product.consultation.locations.map((loc) => (
                                        <div key={loc.slug} className="pt-4 border-t border-white/5 first:border-0 first:pt-0">
                                            <div className="flex items-center gap-2 mb-3 text-[#db312a] font-semibold">
                                                <MapPin size={16} />
                                                <span>{loc.name}</span>
                                            </div>

                                            <div className="space-y-3">
                                                {loc.contacts.map((contact, idx) => (
                                                    <div key={idx} className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
                                                        <p className="text-white text-sm font-medium mb-1">{contact.name}</p>

                                                        {/* Roles Chips */}
                                                        {Array.isArray(contact.role) ? (
                                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                                {contact.role.map((r, i) => (
                                                                    <span key={i} className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-white/5">
                                                                        {r}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-zinc-500 text-xs mb-2">{contact.role}</p>
                                                        )}

                                                        <div className="flex gap-2 mt-2">
                                                            {/* Whatsapp */}
                                                            <a
                                                                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                                                            >
                                                                <MessageCircle size={14} />
                                                                WhatsApp
                                                            </a>
                                                            {/* Phone */}
                                                            <a
                                                                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                                                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                                                            >
                                                                <Phone size={14} />
                                                                Llamar
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Stacked Map for Sidebar */}
                                            {loc.map?.embedHtml && (
                                                <div className="mt-4 rounded-lg overflow-hidden border border-white/5 bg-zinc-900 aspect-video transition-all [&>iframe]:w-full [&>iframe]:h-full"
                                                    dangerouslySetInnerHTML={{ __html: loc.map.embedHtml }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Purchase Button */}
                            {product.purchase && hasValidUrl(product.purchase.url) && (
                                <a
                                    href={product.purchase.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-[#C40000] text-white font-bold py-4 rounded-xl hover:bg-[#a10000] transition-colors shadow-lg shadow-[#C40000]/20"
                                >
                                    {product.purchase.label}
                                </a>
                            )}

                            {/* Coverage Box */}
                            {product.coverage && (
                                <div className="bg-gradient-to-br from-[#C40000] to-[#8a1c1c] rounded-2xl p-6 text-white shadow-xl shadow-[#C40000]/20">
                                    <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-space-grotesk)]">
                                        ¿Es compatible?
                                    </h3>
                                    <p className="text-white/80 text-sm mb-6">
                                        Verifique la cobertura de funciones y vehículos soportados.
                                    </p>
                                    <a
                                        href={product.coverage.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-white text-[#C40000] text-center font-bold py-3 rounded-xl hover:bg-zinc-100 transition-colors"
                                    >
                                        Verificar Cobertura
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </section>


        </div>
    );
}
