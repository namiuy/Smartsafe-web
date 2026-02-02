import React from "react";
import { ConsultationData } from "@/lib/types";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { Container } from "./Container";

interface ConsultationSectionProps {
    consultation: ConsultationData["consultation"];
}

export function ConsultationSection({ consultation }: ConsultationSectionProps) {
    if (!consultation) return null;

    return (
        <section className="py-20 bg-zinc-900 border-t border-white/5">
            <Container>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">
                        {consultation.title}
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        {consultation.description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {consultation.locations.map((location) => (
                        <div key={location.slug} className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden p-6 flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#8a1c1c]/20 flex items-center justify-center text-[#8a1c1c]">
                                    <MapPin size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">{location.name}</h3>
                            </div>

                            {/* Contacts */}
                            <div className="space-y-4 mb-8 flex-1">
                                {location.contacts.map((contact, idx) => (
                                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mt-1 shrink-0">
                                                <Phone size={14} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-sm">{contact.name}</p>

                                                {/* Role rendering: Chips or Text */}
                                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                    {Array.isArray(contact.role) ? (
                                                        contact.role.map((role, rIdx) => (
                                                            <span key={rIdx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-white/5">
                                                                {role}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-white/5">
                                                            {contact.role}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-zinc-500 mt-1 pl-0.5">{contact.phone}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={contact.whatsapp}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#25D366] hover:bg-[#25D366]/10 p-2 rounded-full transition-colors shrink-0 mt-1"
                                            aria-label={`WhatsApp ${contact.name}`}
                                        >
                                            <MessageCircle size={20} />
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {/* Map - Dynamic Embed HTML */}
                            {location.map?.embedHtml ? (
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            {location.map.label || "Ubicación"}
                                        </span>
                                    </div>
                                    <div
                                        className="aspect-[16/9] w-full rounded-xl overflow-hidden transition-all duration-500 bg-zinc-800 [&>iframe]:w-full [&>iframe]:h-full"
                                        dangerouslySetInnerHTML={{ __html: location.map.embedHtml }}
                                    />
                                </div>
                            ) : location.map?.embedUrl ? (
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden transition-all duration-500 bg-zinc-800">
                                        <iframe
                                            src={location.map.embedUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
