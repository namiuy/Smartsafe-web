import React from "react";
import { Container } from "@/components/Container";
import { CheckCircle2 } from "lucide-react";

export function TargetAudience() {
    const targets = [
        "Talleres mecánicos independientes",
        "Concesionarios oficiales",
        "Centros de diagnóstico avanzado",
        "Especialistas en vehículos eléctricos"
    ];

    return (
        <section className="py-12 bg-zinc-900 text-white relative overflow-hidden">
            {/* Background pattern could go here */}
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
                            Tecnología profesional para quienes exigen lo mejor.
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                            Launch proporciona las herramientas que impulsan la eficiencia y precisión en la reparación automotriz moderna.
                        </p>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {targets.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                    <CheckCircle2 className="text-[#C40000] h-6 w-6 flex-shrink-0" />
                                    <span className="font-medium text-zinc-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
