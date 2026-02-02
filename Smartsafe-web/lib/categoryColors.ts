export const CATEGORY_COLORS: Record<string, string> = {
    // Scanners
    'scanner-automotriz': '#C40000', // Launch Red (Legacy)
    'scanners-pro': '#C40000', // Launch Red
    'scanners-independientes': '#ef4444', // Red-500

    // EV Tools (Requested Green)
    'herramientas-ev': '#1ea33c', // Darker Green (Requested)

    // Lift & Align
    'elevadores': '#2563eb', // Blue-600
    'alineadoras': '#ea580c', // Orange-600

    // Fluidos & AC
    'aceites-y-fluidos': '#eab308', // Yellow-500
    'aire-acondicionado': '#06b6d4', // Cyan-500
    'limpia-inyectores': '#8b5cf6', // Violet-500

    // Others
    'adas': '#0891b2', // Cyan-600
    'tpms': '#f97316', // Orange-500
    'programadores': '#db2777', // Pink-600
    'accesorios': '#475569', // Slate-600
    'carros-de-herramientas': '#dc2626', // Red-600
    'linea-hantek': '#0d9488', // Teal-600
    'linea-pesada': '#4b5563', // Gray-600

    // Legacy / Fallbacks
    'balanceadoras': '#16a34a',
    'desmontadoras': '#9333ea',

    // Default fallback
    'default': '#C40000'
};

export const getCategoryColor = (slug: string): string => {
    return CATEGORY_COLORS[slug] || CATEGORY_COLORS['default'];
};
