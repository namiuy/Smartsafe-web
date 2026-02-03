"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, MessageCircle } from "lucide-react";
import { Container } from "./Container";
import { ConsultationModal } from "./ConsultationModal";

import { ConsultationData } from "@/lib/types";

export function Header({ consultationData }: { consultationData: ConsultationData | null }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

    const navigation = [
        { name: "Inicio", href: "/" },
        { name: "Catálogo", href: "/catalogo" },
        { name: "Contacto", href: "/contacto" },
    ];

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-ui-bg-primary text-ui-text-primary shadow-[0_2px_20px_-2px_rgba(74,222,128,0.3)] font-[family-name:var(--font-space-grotesk)] border-b border-brand-accent/60">
                <Container>
                    <div className="flex h-14 items-center justify-between">
                        {/* Logo / Brand */}
                        {/* Logo / Brand Switch */}
                        <div className="flex-shrink-0 flex items-center gap-4">
                            {/* 1. ACTIVE BRAND (SmartSafe) - Static/Non-clickable */}
                            <div className="flex items-baseline gap-1 text-xl font-bold tracking-tight uppercase select-none cursor-default">
                                <span className="text-white">SMARTSAFE</span>
                                <span className="text-brand-primary font-normal">Uruguay</span>
                            </div>

                            {/* 2. SEPARATOR - Pipe | */}
                            <span className="hidden sm:block text-gray-500 text-xl font-light select-none">|</span>

                            {/* 3. INACTIVE BRAND LINK (Launch) - Clickable */}
                            <a
                                href="https://www.launchuruguay.com.uy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group hidden sm:flex items-baseline gap-1 text-xl font-bold tracking-tight uppercase transition-colors duration-300"
                            >
                                {/* "LAUNCH" turns WHITE on hover */}
                                <span className="text-gray-500 group-hover:text-white transition-colors">
                                    LAUNCH
                                </span>

                                {/* "Uruguay" turns LAUNCH RED on hover */}
                                <span className="text-gray-500 group-hover:text-[var(--color-brand-launch)] font-normal transition-colors">
                                    Uruguay
                                </span>
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex md:gap-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-ui-text-secondary hover:text-brand-accent transition-all uppercase tracking-wide"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden md:flex md:items-center md:gap-x-4">
                            <a
                                href="https://wa.me/59898155763"
                                className="text-ui-text-secondary hover:text-[#25D366] transition-colors"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="h-5 w-5" />
                            </a>
                            <button
                                onClick={() => setIsConsultationModalOpen(true)}
                                className="rounded-full border border-brand-primary bg-transparent px-5 py-1.5 text-xs font-bold text-brand-accent hover:bg-brand-primary hover:text-white transition-all uppercase tracking-wider"
                            >
                                Consultas
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-100 hover:text-brand-accent"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </Container>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-brand-primary bg-ui-bg-primary text-white">
                        <Container className="py-4 space-y-4">
                            <div className="flex flex-col space-y-3">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-base font-medium text-ui-text-secondary hover:text-brand-accent uppercase tracking-wide"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="border-t border-zinc-800 pt-4 flex flex-col gap-3">
                                <a
                                    href="https://wa.me/59898155763"
                                    className="flex items-center gap-2 text-ui-text-secondary hover:text-[#25D366] transition-colors"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span>WhatsApp</span>
                                </a>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsConsultationModalOpen(true);
                                    }}
                                    className="w-full rounded-full border border-brand-primary bg-transparent px-4 py-2 text-sm font-bold text-brand-accent hover:bg-brand-primary hover:text-white transition-all uppercase tracking-wider"
                                >
                                    Consultas
                                </button>
                            </div>
                        </Container>
                    </div>
                )}
            </header>

            {/* Consultation Modal */}
            <ConsultationModal
                isOpen={isConsultationModalOpen}
                onClose={() => setIsConsultationModalOpen(false)}
                consultationData={consultationData}
            />
        </>
    );
}
