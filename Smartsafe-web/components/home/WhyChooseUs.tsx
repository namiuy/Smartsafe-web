import React from "react";
import { Container } from "@/components/Container";
import { ShieldCheck, Users, GraduationCap, PenTool } from "lucide-react";

export function WhyChooseUs() {
    const reasons = [
        {
            icon: ShieldCheck,
            title: "Representante Oficial",
            description: "Garantía y respaldo directo de fábrica. Productos 100% originales."
        },
        {
            icon: Users,
            title: "Soporte Local",
            description: "Servicio técnico especializado y repuestos en Uruguay."
        },
        {
            icon: GraduationCap,
            title: "Capacitación",
            description: "Entrenamiento experto para sacar el máximo provecho a su equipo."
        },
        {
            icon: PenTool,
            title: "Soluciones Integrales",
            description: "Equipamiento para diagnóstico, elevación y mantenimiento."
        }
    ];

    return (
        <section className="py-12 bg-gradient-to-b from-[#8a1c1c] to-[#600f0f] text-white">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {reasons.map((reason, idx) => (
                        <div key={idx} className="flex flex-col items-start">
                            <div className="h-12 w-12 rounded-full bg-black/20 flex items-center justify-center mb-6 text-white border border-white/10">
                                <reason.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
                                {reason.title}
                            </h3>
                            <p className="text-sm text-zinc-200 leading-relaxed">
                                {reason.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
