"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryColor } from '@/lib/categoryColors';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const images = product.galleryImages && product.galleryImages.length > 0
        ? product.galleryImages
        : [product.image || '/images/placeholder.jpg'];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Theme Override: Green for EV, Default Red for others
    const accentColor = product.categorySlug === 'herramientas-ev' ? '#1ea33c' : '#db312a';

    // Auto-advance carousel
    React.useEffect(() => {
        if (images.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length, isHovered]);

    // Simple manual navigation
    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300"
            style={{
                // Use CSS variables or inline styles for dynamic hover colors
                // Note: Tailwind arbitrary values with dynamic strings don't work well, so we use style for the specific color interactions
                borderColor: isHovered ? `${accentColor}80` : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isHovered ? `0 0 30px -5px ${accentColor}4D` : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Card Link - Covers entire card */}
            <Link
                href={`/categorias/${product.categorySlug}/${product.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`Ver detalles de ${product.title}`}
            />

            {/* Badge */}
            {product.badge && (
                <div
                    className="absolute left-4 top-4 z-20 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg shadow-black/20 pointer-events-none"
                    style={{ backgroundColor: accentColor }}
                >
                    {product.badge}
                </div>
            )}

            {/* Image Carousel Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/20">
                <Image
                    src={images[currentIndex]}
                    alt={`${product.title} - Image ${currentIndex + 1}`}
                    fill
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                {/* Carousel Controls - Higher z-index to be clickable */}
                {images.length > 1 && (
                    <>
                        <div
                            onClick={prevImage}
                            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-all duration-300 cursor-pointer ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                            style={{ backgroundColor: isHovered ? 'rgba(0,0,0,0.6)' : undefined }}
                        >
                            <ChevronLeft size={18} className="hover:text-white" style={{ color: isHovered ? accentColor : 'white' }} />
                        </div>
                        <div
                            onClick={nextImage}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-all duration-300 cursor-pointer ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                            style={{ backgroundColor: isHovered ? 'rgba(0,0,0,0.6)' : undefined }}
                        >
                            <ChevronRight size={18} className="hover:text-white" style={{ color: isHovered ? accentColor : 'white' }} />
                        </div>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 shadow-sm' : 'w-1 bg-white/40'}`}
                                    style={{ backgroundColor: idx === currentIndex ? accentColor : undefined }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6 pointer-events-none">
                <h3
                    className="mb-2 text-lg font-bold text-white transition-colors"
                    style={{ color: isHovered ? accentColor : 'white' }}
                >
                    {product.title}
                </h3>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-white/60">
                    {product.shortDescription}
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    {/* Coverage Link (if available) - z-30 to be clickable over the main link */}
                    {product.coverage ? (
                        <a
                            href={product.coverage?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-medium text-white/50 transition-colors hover:text-white pointer-events-auto z-30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CheckCircle2 className="h-4 w-4" style={{ color: accentColor }} />
                            <span>Compatibilidad</span>
                        </a>
                    ) : (
                        <span /> /* Spacer */
                    )}

                    {/* View Details Text (Visual only, part of the card link functionality now) */}
                    <span className="flex items-center gap-2 text-sm font-bold text-white transition-all group-hover:translate-x-1">
                        Ver Detalles
                        <ArrowRight className="h-4 w-4" style={{ color: accentColor }} />
                    </span>
                </div>
            </div>
        </div>
    );
}
