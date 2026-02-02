import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { getContactData } from "@/lib/api";
import { MapPin, Phone, MessageCircle, User } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contacto - Launch Uruguay",
    description: "Contacta con nuestro equipo en nuestros locales de Centro y Bulevar para asesoramiento y ventas.",
};

export default async function ContactPage() {
    const data = await getContactData();

    if (!data) {
        return (
            <div className="min-h-screen bg-zinc-950 pt-32 text-center text-white">
                <Container>
                    <h1 className="text-3xl font-bold">Error al cargar datos de contacto.</h1>
                </Container>
            </div>
        );
    }

    const { consultation } = data;

    return (
        <div className="min-h-screen bg-zinc-950 font-sans">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-[#8a1c1c] py-24 md:py-32">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <Container className="relative z-10 text-center">
                    <h1 className="mb-6 text-5xl md:text-6xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                        Contacto
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/80 leading-relaxed">
                        {consultation.description}
                    </p>
                </Container>
            </div>

            <Container className="py-20">
                {/* Locations Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:gap-12 mb-20">
                    {consultation.locations.map((location) => (
                        <div
                            key={location.slug}
                            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/[0.07]"
                        >
                            <div className="mb-8 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8a1c1c] text-white shadow-lg shadow-red-900/20">
                                    <MapPin size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                                    {location.name}
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {location.contacts.map((contact, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-black/20 p-4 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{contact.name}</p>
                                                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                                                    {/* Role rendering */}
                                                    {Array.isArray(contact.role) ? (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {contact.role.map((r, i) => (
                                                                <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-700 text-zinc-300">
                                                                    {r}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span>{contact.role}</span>
                                                    )}
                                                    <span className="w-1 h-1 rounded-full bg-zinc-600 block mx-1"></span>
                                                    <span>{contact.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <a
                                            href={contact.whatsapp}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-green-900/20 whitespace-nowrap"
                                        >
                                            <MessageCircle size={18} />
                                            WhatsApp
                                        </a>
                                    </div>
                                ))}

                                {/* Dynamic Map Section per Location */}
                                {(location.map?.embedHtml || location.map?.embedUrl) && (
                                    <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                                        <div className="aspect-[16/9] w-full relative">
                                            {location.map.embedHtml ? (
                                                <div
                                                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full transition-all duration-700"
                                                    dangerouslySetInnerHTML={{ __html: location.map.embedHtml }}
                                                />
                                            ) : (
                                                <iframe
                                                    src={location.map.embedUrl}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0, filter: "grayscale(1) contrast(1.2) opacity(0.8)" }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    className="grayscale hover:grayscale-0 transition-all duration-700 block"
                                                />
                                            )}
                                        </div>
                                        <div className="p-4 flex justify-end bg-white/5">
                                            <span className="inline-flex items-center gap-2 text-sm font-medium text-white/50">
                                                <MapPin size={16} />
                                                {location.map.label || "Ubicación"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
