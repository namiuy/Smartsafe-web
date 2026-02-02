"use client";

import React, { useState, useEffect } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { ProductConsultation } from "@/lib/types";
import { hasValidUrl } from "@/lib/utils";

interface ProductCTAProps {
    purchaseUrl?: string;
    productTitle: string;
    categorySlug: string;
    // We need the resolved global consultation data passed from server
    consultationData: ProductConsultation;
    // CTA override texts
    ctaPrimaryLabel?: string;
    ctaWhatsappText?: string;
    ctaSecondaryLabel?: string;
}

export function ProductCTA({
    purchaseUrl,
    productTitle,
    categorySlug,
    consultationData,
    ctaPrimaryLabel,
    ctaWhatsappText,
    ctaSecondaryLabel
}: ProductCTAProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, []);

    // Derived Consultation Data wrapper for the modal
    const consultationWrapper = {
        consultation: consultationData,
        productTitle,
        productUrl: currentUrl
    };

    const isPurchaseAvailable = hasValidUrl(purchaseUrl);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {isPurchaseAvailable ? (
                    // CASE A: Purchase URL exists -> Buy + Consult
                    <>
                        <a
                            href={purchaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-full bg-white px-8 py-3 md:py-4 text-center text-base font-bold text-[#db312a] shadow-lg hover:bg-zinc-100 transition-colors"
                        >
                            {ctaPrimaryLabel || "Comprar en Nami"}
                        </a>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 rounded-full border-2 border-zinc-200 px-8 py-3 md:py-4 text-center text-base font-bold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            {ctaSecondaryLabel || "Consultar disponibilidad"}
                        </button>
                    </>
                ) : (
                    // CASE B: No Purchase URL -> Consult Only (linking to contact page)
                    <a
                        href="/contacto"
                        className="flex-1 rounded-full bg-white px-8 py-3 md:py-4 text-center text-base font-bold text-[#db312a] shadow-lg hover:bg-zinc-100 transition-colors"
                    >
                        Consultar disponibilidad
                    </a>
                )}
            </div>

            <ConsultationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                consultationData={consultationWrapper}
            />
        </>
    );
}
