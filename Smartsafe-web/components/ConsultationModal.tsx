"use client";

import React from "react";
import { X, MapPin, Phone, MessageCircle } from "lucide-react";
import { ConsultationData } from "@/lib/types";

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    consultationData: (ConsultationData & { productTitle?: string; productUrl?: string }) | null;
}

export function ConsultationModal({ isOpen, onClose, consultationData }: ConsultationModalProps) {
    if (!isOpen || !consultationData) return null;

    const { locations } = consultationData.consultation;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Scrollable Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal Content */}
                <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900 my-8">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                        <h2 className="text-xl font-bold text-[#963623] dark:text-red-500">
                            {consultationData.consultation.title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {locations.map((location, index) => (
                            <div
                                key={location.slug}
                                className={`p-6 flex flex-col h-full ${index === 0 ? "border-b border-zinc-100 md:border-b-0 md:border-r dark:border-zinc-800" : ""}`}
                            >
                                <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    {location.name}
                                </h3>

                                <div className="mb-6 space-y-3 flex-1">
                                    {/* Address */}
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-1 h-5 w-5 text-[#963623]" />
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {location.slug === 'centro' ? 'Cerro Largo 1518' : 'Bv. Gral. Artigas 3397, 11800 Montevideo'}
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        {location.contacts.map((contact, idx) => (
                                            <div key={idx} className="flex flex-col gap-1 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-zinc-400" />
                                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                                                            {contact.name}
                                                        </span>
                                                    </div>
                                                    <a
                                                        href={`${contact.whatsapp}?text=${encodeURIComponent(`Hola, estoy interesado en ${consultationData.productTitle ? consultationData.productTitle : 'sus productos'} (${consultationData.productUrl || window.location.href}). Quisiera más información.`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-medium text-[#25D366] hover:underline flex items-center gap-1"
                                                    >
                                                        WhatsApp <MessageCircle size={12} />
                                                    </a>
                                                </div>

                                                {/* Chips for Roles */}
                                                <div className="pl-6 flex flex-wrap gap-1">
                                                    {Array.isArray(contact.role) ? (
                                                        contact.role.map((role, rIdx) => (
                                                            <span key={rIdx} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                                {role}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                            {contact.role}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="pl-6">
                                                    <a href={`tel:${contact.phone}`} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                                                        {contact.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Map */}
                                {location.map?.embedHtml ? (
                                    <div className="h-48 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 mt-auto [&>iframe]:w-full [&>iframe]:h-full"
                                        dangerouslySetInnerHTML={{ __html: location.map.embedHtml }}
                                    />
                                ) : location.map?.embedUrl ? (
                                    <div className="h-48 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 mt-auto">
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
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
