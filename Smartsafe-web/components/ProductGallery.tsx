"use client";
import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 md:gap-4">
            {/* Main Image */}
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl bg-black/20 border border-white/5">
                {/* Next.js Image optimization requires domain config, so using simple img for filesystem/local flexibility or unoptimized if needed. 
                    Ideally use <Image> but simple <img> is safer for dynamic local files without config.
                    Let's try standard <img> for stability with local file paths first.
                 */}
                <img
                    src={selectedImage}
                    alt={title}
                    className="h-full w-full object-contain p-4"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={`relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all snap-start ${selectedImage === img
                                ? "border-[#db312a] opacity-100"
                                : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <img
                                src={img}
                                alt={`${title} view ${idx + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
