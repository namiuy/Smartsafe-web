"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import {
    Car,
    Wrench,
    Scan,
    Laptop,
    Settings,
    Battery,
    Thermometer,
    Droplets,
    Gauge
} from "lucide-react";

const IconMap: Record<string, React.ElementType> = {
    "CarProfile": Car,
    "Elevator": Wrench,
    "Scanner": Scan,
    "Laptop": Laptop,
    "Gear": Settings,
    "Battery": Battery,
    "Thermometer": Thermometer,
    "Drop": Droplets,
    "Gauge": Gauge,
    "default": Settings
};

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const IconComponent = IconMap[category.icon || "default"] || IconMap["default"];

    // Explicitly prefer the category.image (which respects the override)
    // If not set, allow fallback to previews[0] (but no cycling)
    const imageSrc = category.image || (category.previews && category.previews.length > 0 ? category.previews[0] : null);

    return (
        <Link
            href={`/categorias/${category.slug}`}
            className="group relative flex flex-col justify-between p-8 rounded-xl border border-white/10 bg-[#8a1c1c] transition-all duration-300 hover:border-white/30 hover:shadow-2xl overflow-hidden min-h-[280px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Image Layer - Constrained to Right Side */}
            {imageSrc && (
                <div className="absolute right-0 top-0 bottom-0 w-[55%] z-0 overflow-hidden">
                    {/* Gradient Mask on the LEFT edge of the image container to blend into red */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#8a1c1c] via-transparent to-transparent" />

                    {/* The image itself - Centered within the right sector */}
                    <div className="relative h-full w-full">
                        <Image
                            src={imageSrc}
                            alt=""
                            fill
                            className={`object-cover object-center /* Centered in the right 55% zone */
                                transition-all duration-500 ease-in-out
                                ${isHovered ? 'scale-110 saturate-110' : 'scale-100 saturate-[0.85]'}
                            `}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={true}
                        />
                    </div>
                </div>
            )}

            {/* Content Container - Left Side */}
            <div className="relative z-10 flex flex-col h-full pointer-events-none max-w-[50%]">
                <div className="mb-6">
                    <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10 shadow-sm transition-colors group-hover:bg-white/20">
                        {category.logo ? (
                            <Image
                                src={category.logo}
                                alt={`${category.title} icon`}
                                fill
                                className="object-contain p-2"
                            />
                        ) : (
                            <IconComponent className="h-6 w-6" />
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-space-grotesk)] drop-shadow-sm">
                        {category.title}
                    </h2>

                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                        {category.shortDescription}
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-4 flex items-center text-sm font-bold text-white transition-all duration-300 group-hover:translate-x-1">
                    <span className="uppercase tracking-wide text-xs border-b border-white/20 group-hover:border-white/60 pb-0.5 transition-colors">Ver productos</span>
                    <span className="ml-2">→</span>
                </div>
            </div>
        </Link>
    );
}
