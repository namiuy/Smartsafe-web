import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getProductBySlug } from "@/lib/api";
import {
    ProductSection,
    ListSection,
    BadgeSection,
    TextSection
} from "@/lib/types";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCTA } from "@/components/ProductCTA"; // New Import
import { Check, Info } from "lucide-react";

interface PageProps {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

// Section Renderers
function Highlights({ section }: { section: ListSection }) {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-l-4 border-[#db312a] pl-4">
                {section.title || "Destacados"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-8/50">
                        <Check className="h-5 w-5 text-[#db312a] mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Specs({ section }: { section: BadgeSection }) {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-l-4 border-[#db312a] pl-4">
                {section.title || "Especificaciones"}
            </h2>
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {section.items.map((item, idx) => (
                            <tr key={idx} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100 w-1/3">
                                    {item.label}
                                </td>
                                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                    {item.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Compatibility({ section }: { section: ListSection }) {
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 border-l-4 border-[#db312a] pl-4">
                {section.title || "Compatibilidad"}
            </h2>
            <div className="flex flex-wrap gap-2">
                {section.items.map((item, idx) => (
                    <span
                        key={idx}
                        className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

function Notes({ section }: { section: TextSection }) {
    return (
        <div className="mb-12 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
            <div className="flex items-start gap-4">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        {section.title || "Nota Importante"}
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200">
                        {section.text}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default async function ProductPage({ params }: PageProps) {
    const { category, slug } = await params;
    const product = await getProductBySlug(category, slug);

    if (!product) {
        notFound();
    }

    return (
        <Container className="py-12">
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center text-sm text-zinc-300">
                <Link href="/catalogo" className="hover:text-white">Catálogo</Link>
                <span className="mx-2">/</span>
                <span className="capitalize">{category}</span>
                <span className="mx-2">/</span>
                <span className="text-white font-medium">{product.title}</span>
            </div>

            {/* ... inside ProductPage component ... */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Image Section - Gallery Support */}
                <div>
                    {product.galleryImages && product.galleryImages.length > 0 ? (
                        <ProductGallery images={product.galleryImages} title={product.title} />
                    ) : (
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/20 border border-white/20">
                            {/* Fallback for single image defined in JSON 'image' field if no gallery folder */}
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-full w-full object-contain p-4"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-white/50">
                                    <span className="text-2xl font-bold">{product.title}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Product Info Header */}
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
                        {product.title}
                    </h1>
                    <p className="text-xl text-zinc-100 mb-8">
                        {product.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-3xl font-bold text-[#db312a]">
                            {product.price || "Consultar"}
                        </span>
                    </div>

                    <div className="mt-8">
                        <ProductCTA
                            purchaseUrl={product.purchase?.url}
                            productTitle={product.title}
                            categorySlug={category}
                            consultationData={product.consultation}
                            ctaPrimaryLabel={product.cta?.primaryLabel}
                            ctaWhatsappText={product.cta?.whatsappText}
                            ctaSecondaryLabel={product.cta?.secondaryLabel}
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Sections */}
            <div className="max-w-4xl mx-auto">
                {product.sections.map((section, idx) => {
                    switch (section.type) {
                        case 'highlights':
                            return <Highlights key={idx} section={section as ListSection} />;
                        case 'specs':
                            return <Specs key={idx} section={section as BadgeSection} />;
                        case 'compatibility':
                            return <Compatibility key={idx} section={section as ListSection} />;
                        case 'notes':
                            return <Notes key={idx} section={section as TextSection} />;
                        default:
                            return null;
                    }
                })}
            </div>
        </Container>
    );
}
