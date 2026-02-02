"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { Phone, Instagram, Facebook, Twitter, Linkedin, Youtube, ExternalLink, MapPin } from "lucide-react";
import launchData from "@/content/company/launch/launch.json";

export function Footer() {
    const iconMap: Record<string, React.ReactNode> = {
        instagram: <Instagram size={24} strokeWidth={1.5} />,
        facebook: <Facebook size={24} strokeWidth={1.5} />,
        location: <MapPin size={24} strokeWidth={1.5} />,
        twitter: <Twitter size={24} strokeWidth={1.5} />,
        linkedin: <Linkedin size={24} strokeWidth={1.5} />,
        youtube: <Youtube size={24} strokeWidth={1.5} />,
        tiktok: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-music-2"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 1-3-3" />
                <path d="M16 12a3 3 0 0 0-3 3v7a3 3 0 0 1-3-3" />
            </svg>
            /* This is a placeholder music icon style for TikTok if missing, let's use a more accurate path if possible or stick to simple. 
               Actually, let's use the actual TikTok path to look professional. */
        ),
    };

    // Better TikTok Path
    iconMap.tiktok = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
    );


    return (
        <footer className="bg-[#111111] text-zinc-400 border-t border-white/5 font-[family-name:var(--font-space-grotesk)] relative">
            <Container className="py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* 1. Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block opacity-90 hover:opacity-100 transition-opacity">
                            <Image
                                src="/images/logo.png"
                                alt="Launch Uruguay"
                                width={280}
                                height={70}
                                className="h-20 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-zinc-400 max-w-xs">
                            El estándar profesional en diagnóstico automotriz. Tecnología Launch con soporte local en Uruguay.
                        </p>
                        <div className="pt-2">
                            <div className="h-px w-12 bg-[#8a1c1c]/50 mb-4" />
                            <p className="text-xs text-zinc-500 font-medium">
                                Distribución y soporte oficial por Nami Uruguay.
                            </p>
                        </div>
                    </div>

                    {/* 2. Navigation */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Navegación</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/#hero" className="hover:text-[#C40000] transition-colors block py-0.5">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/catalogo" className="hover:text-[#C40000] transition-colors block py-0.5">
                                    Catálogo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3. Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Contacto</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center gap-3">
                                <span className="flex-shrink-0 text-[#C40000]"><Phone size={16} /></span>
                                <span className="hover:text-white transition-colors cursor-default">Facundo: 092 748 865</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="flex-shrink-0 text-[#C40000]"><Phone size={16} /></span>
                                <span className="hover:text-white transition-colors cursor-default">Luis P.: 098 155 763</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="flex-shrink-0 text-[#C40000]"><Phone size={16} /></span>
                                <span className="hover:text-white transition-colors cursor-default">Sucursal Bulevar: 098 829 026</span>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Socials & Partner */}
                    <div className="flex flex-col h-full gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
                                {launchData.social.title}
                            </h3>

                            {/* Social Icons */}
                            <div className="flex gap-5 items-center">
                                {launchData.social.links.map((social) => (
                                    <a
                                        key={social.slug}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={social.label}
                                        aria-label={social.label}
                                        className="text-zinc-500 hover:text-[#C40000] hover:scale-110 transition-all duration-300"
                                    >
                                        {iconMap[social.slug] || <ExternalLink size={24} strokeWidth={1.5} />}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Partner Block / Direct Purchase */}
                        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/5 mt-auto hover:border-white/10 transition-colors">
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Compra directa</h4>
                            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                                Disponibilidad inmediata y compra online a través de Nami Uruguay, canal oficial.
                            </p>
                            <a
                                href="https://www.herramientas.nami.com.uy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#C40000] px-4 py-3 text-xs font-bold text-white hover:bg-[#a00000] transition-all uppercase tracking-wider shadow-lg shadow-red-900/20 active:scale-[0.98]"
                            >
                                <span>Comprar en Nami Uruguay</span>
                                <ExternalLink className="h-3 w-3 opacity-80" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-20 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-xs text-zinc-600">
                        &copy; {new Date().getFullYear()} Launch Uruguay. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-zinc-600/60 flex items-center gap-2">
                        <span>Powered by Nami</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span>Montevideo, Uruguay</span>
                    </p>
                </div>
            </Container>
        </footer>
    );
}
