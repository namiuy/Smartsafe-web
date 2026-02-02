"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ChevronDown } from "lucide-react";

interface ProductListProps {
    initialProducts: Product[];
    gridClassName: string;
}

type SortOption = "featured" | "az" | "za";

export function ProductList({ initialProducts, gridClassName }: ProductListProps) {
    const [sortOption, setSortOption] = useState<SortOption>("featured");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const sortedProducts = useMemo(() => {
        // Create a copy to avoid mutating props
        const products = [...initialProducts];

        return products.sort((a, b) => {
            switch (sortOption) {
                case "featured":
                    // 1. Featured first
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;

                    // 2. Order numeric (1 is top priority, so smaller is better)
                    // If order is missing (null/undefined), treat as very large number (end of list)
                    const orderA = a.order ?? 999999;
                    const orderB = b.order ?? 999999;
                    if (orderA !== orderB) return orderA - orderB;

                    // 3. Stable fallback (Title)
                    return a.title.localeCompare(b.title);

                case "az":
                    return a.title.localeCompare(b.title, undefined, { sensitivity: 'base', numeric: true });

                case "za":
                    return b.title.localeCompare(a.title, undefined, { sensitivity: 'base', numeric: true });

                default:
                    return 0;
            }
        });
    }, [initialProducts, sortOption]);

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        setIsDropdownOpen(false);
    };

    const getSortLabel = (option: SortOption) => {
        switch (option) {
            case "featured": return "Destacados";
            case "az": return "Nombre (A-Z)";
            case "za": return "Nombre (Z-A)";
        }
    };

    return (
        <div className="w-full">
            {/* Catalog Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                {/* Left: Count */}
                <div className="text-zinc-500 text-sm font-medium bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
                    Mostrando <span className="text-zinc-200 font-semibold">{sortedProducts.length}</span> productos
                </div>

                {/* Right: Sort Control */}
                <div className="relative z-30 w-full sm:w-auto">
                    <div className="flex items-center">
                        <span className="text-zinc-500 text-sm font-medium mr-3 hidden sm:inline-block">Ordenar:</span>

                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full sm:w-[200px] h-10 px-4 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/20 hover:bg-zinc-800 text-zinc-200 text-sm font-medium flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-[#C40000]/50"
                            >
                                <span className="truncate mr-2">
                                    {getSortLabel(sortOption)}
                                </span>
                                <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-20"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-full sm:w-[200px] bg-zinc-900 border border-white/10 rounded-lg shadow-2xl overflow-hidden z-30 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
                                        {(["featured", "az", "za"] as SortOption[]).map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => handleSortChange(option)}
                                                className={`px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 flex items-center justify-between ${sortOption === option ? "text-[#C40000] font-bold bg-white/[0.02]" : "text-zinc-400"
                                                    }`}
                                            >
                                                {getSortLabel(option)}
                                                {sortOption === option && <div className="w-1.5 h-1.5 rounded-full bg-[#C40000]" />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className={`grid gap-6 ${gridClassName}`}>
                {sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                        <p className="text-zinc-300 text-lg">No se encontraron productos.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
