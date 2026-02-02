"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { Product } from "@/lib/types";
import { getCategoryColor } from "@/lib/categoryColors";

interface HeroCarouselProps {
    products?: Product[];
    images?: string[];
    alt?: string;
    enableSmartScaling?: boolean;
    variant?: 'default' | 'compact';
}

export function HeroCarousel({ products = [], images = [], alt = "Hero Image", variant = 'default', enableSmartScaling = false }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [aspectRatios, setAspectRatios] = useState<Record<number, number>>({});

    // Determine items based on props (products or simple images)
    const items = products.length > 0 ? products : images;
    const count = items.length;

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % count);
    }, [count]);

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + count) % count);
    }, [count]);

    // Auto-play: 5000ms (5 seconds)
    useEffect(() => {
        if (count <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [count, nextSlide]);

    const handleImageLoad = (index: number, { naturalWidth, naturalHeight }: { naturalWidth: number; naturalHeight: number }) => {
        if (naturalHeight > 0) {
            const ratio = naturalWidth / naturalHeight;
            setAspectRatios(prev => ({ ...prev, [index]: ratio }));
        }
    };

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    if (count === 0) return null;

    return (
        <div
            id="hero"
            className={`relative overflow-hidden bg-black group ${variant === 'default' ? 'h-[50vh] min-h-[400px] lg:h-[85vh] lg:min-h-[600px]' : 'h-full'}`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Background Effects (Static) */}
            <div className="absolute inset-0 bg-[#8a1c1c]/10 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />

            {/* Slides Container */}
            {items.map((item, index) => {
                const isActive = index === current;
                // Normalize item data
                const isProduct = products.length > 0;
                const product = isProduct ? (item as Product) : null;
                const imageSrc = isProduct ? (item as Product).image : (item as string);

                // Smart Scaling Calculation
                const ratio = aspectRatios[index] || 0;
                const isWide = ratio > 1.6;
                const shouldScale = enableSmartScaling && isWide;

                // Mobile Link Wrapper Logic
                const content = (
                    <div className={`relative w-full transition-all duration-1000 ${variant === 'default' ? 'aspect-square max-w-[280px] xs:max-w-[320px] lg:max-w-[550px]' : 'h-full flex items-center justify-center'} ${isActive ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
                        }`}>
                        <Image
                            src={imageSrc || "/images/placeholder.png"}
                            alt={product?.title || alt}
                            fill
                            className={`object-contain drop-shadow-2xl ${variant === 'compact' ? 'p-0 object-center' : 'p-0 lg:p-4'}`}
                            priority={index === 0}
                            onLoadingComplete={(e) => handleImageLoad(index, e)}
                            style={{
                                transform: shouldScale ? 'scale(1.5)' : 'none',
                                transformOrigin: 'center center',
                                transition: 'transform 0.5s ease-out'
                            }}
                        />
                    </div>
                );

                return (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isActive
                            ? "opacity-100 visible z-10"
                            : "opacity-0 invisible z-0 scale-105 pointer-events-none"
                            }`}
                    >
                        <Container className="relative h-full">
                            <div className={`h-full grid ${variant === 'default' ? 'grid-cols-1 lg:grid-cols-2 items-center content-center gap-2 lg:gap-12 pb-8 lg:pb-0' : 'grid-cols-1 items-center justify-center gap-0 pb-0'}`}>

                                {/* Text Column (Only in default mode, and only if it's a product) */}
                                {variant === 'default' && product && (
                                    <div className={`flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-2 lg:space-y-6 transition-all duration-700 delay-100 order-2 lg:order-1 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                                        }`}>


                                        <div>
                                            {/* Category Tag - Hidden on Mobile */}
                                            {product.categorySlug && product.categoryTitle && (
                                                <span
                                                    className="hidden lg:inline-block text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wider mr-3"
                                                    style={{ backgroundColor: getCategoryColor(product.categorySlug) }}
                                                >
                                                    {product.categoryTitle}
                                                </span>
                                            )}

                                            {product.badge && (
                                                <span className="hidden lg:inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wider">
                                                    {product.badge}
                                                </span>
                                            )}

                                            <h2 className="text-2xl xs:text-3xl lg:text-6xl font-bold text-white leading-tight font-[family-name:var(--font-space-grotesk)] max-w-[20ch] lg:max-w-none mx-auto lg:mx-0 mt-2 lg:mt-0">
                                                {product.title}
                                            </h2>
                                        </div>

                                        <p className="hidden lg:block text-lg lg:text-xl text-zinc-300 max-w-lg leading-relaxed line-clamp-3">
                                            {product.shortDescription}
                                        </p>

                                        <div className="hidden lg:flex flex-wrap gap-4 pt-2">
                                            <Link
                                                href={`/categorias/${product.categorySlug}/${product.slug}`}
                                                className="bg-[#C40000] hover:bg-[#a00000] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-red-900/20 flex items-center gap-2 group/btn"
                                            >
                                                Ver Detalles
                                                <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                            <Link
                                                href={product?.categorySlug ? `/categorias/${product.categorySlug}` : "/catalogo"}
                                                className="border border-white/20 hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold transition-all"
                                            >
                                                Explorar Categoría
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Image Column */}
                                <div className={`relative w-full flex items-center justify-center order-1 lg:order-2 ${variant === 'compact' ? 'p-0 h-full' : 'p-0 lg:p-8 h-[35vh] lg:h-full'}`}>
                                    {/* Blob Effect */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] lg:w-[500px] h-[250px] lg:h-[500px] bg-[#C40000] rounded-full blur-[80px] lg:blur-[120px] opacity-20 animate-pulse" />

                                    {/* Link wrapper for mobile (or desktop if user wants everything clickable, but req says mobile) */}
                                    {/* Actually, user said "when you click on the image it sends you to the product page" */}
                                    {variant === 'default' && product ? (
                                        <Link href={`/categorias/${product.categorySlug}/${product.slug}`} className="w-full flex justify-center h-full items-center">
                                            {content}
                                        </Link>
                                    ) : (
                                        content
                                    )}
                                </div>
                            </div>
                        </Container>
                    </div>
                );
            })}

            {/* Navigation Arrows - Hidden on Mobile */}
            {count > 1 && (
                <div className="hidden lg:block">
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-[#C40000] text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110 active:scale-95 group"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-[#C40000] text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110 active:scale-95 group"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            )}

            {/* Indicators */}
            {count > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? "w-6 bg-[#C40000]" : "w-1.5 bg-white/30 hover:bg-white/50"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
