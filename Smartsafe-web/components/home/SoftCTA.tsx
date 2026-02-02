import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";

export function SoftCTA() {
    return (
        <section className="py-12 bg-[#0E0E0E] text-center border-t border-zinc-800">
            <Container>
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                        ¿Busca asesoramiento experto?
                    </h2>
                    <p className="text-lg text-zinc-400">
                        Nuestro equipo técnico está listo para ayudarle a equipar su taller con la herramienta adecuada.
                    </p>
                    <div>
                        <Link
                            href="/contacto"
                            className="inline-flex items-center justify-center rounded-full bg-[#C40000] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-white hover:text-[#C40000] hover:scale-105"
                        >
                            Hablar con un Asesor
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
