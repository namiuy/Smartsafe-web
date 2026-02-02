import React from "react";
import { Container } from "@/components/Container";

export default function CategoriasPage() {
    return (
        <Container className="py-12">
            <h1 className="text-3xl font-bold text-red-900 dark:text-red-500 mb-6">Categorías</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Encuentra lo que buscas por categoría. Próximamente.
            </p>
        </Container>
    );
}
