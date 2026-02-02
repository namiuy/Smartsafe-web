export type ProductSectionType =
    | 'highlights'
    | 'compatibility'
    | 'specs'
    | 'notes'
    | 'functions'
    | 'included'
    | 'service'
    | 'addons'
    | 'remote'
    | 'applications'
    | 'coverage';

export interface BaseSection {
    type: ProductSectionType;
    title?: string;
}

export interface ListSection extends BaseSection {
    items: string[];
}

export interface TextSection extends BaseSection {
    text: string;
}

export interface BadgeSection extends BaseSection {
    items: { label: string; value: string }[];
}

// Unified ProductSection (Add more specific types if structure differs significantly)
export type ProductSection = ListSection | TextSection | BadgeSection;

// --- CATEGORY TYPES ---

export interface CategoryBase {
    slug: string; // Runtime
    title: string;
    shortDescription: string;
    order: number;
    isActive: boolean;

    // Visuals
    logo?: string; // Runtime normalized
    icon?: string; // Optional path to SVG
    image?: string; // Cover image
    carrousele?: string; // Folder path
    carrouselImages?: string[]; // Runtime populated (images in carrousele folder)

    // Feature Flags
    enableHoverPreview?: boolean; // Default true
    previews?: string[]; // Runtime populated for hover effect

    // SEO
    seo?: {
        title: string;
        description: string;
    };
}

// Extensible for specific category needs (e.g. TPMS might have specific filters)
export interface Category extends CategoryBase {
    // V2 / Pro fields
    template?: string;
    defaultSections?: string[];
    filters?: string[];
    tags?: string[];

    // Dynamic Hero & Banner
    featuredHeroProductSlug?: string;
    categoryBanner?: {
        mode: "auto-from-products" | "custom";
        imageIndex: number;
        limit: number;
    };
}

// --- PRODUCT TYPES ---

export interface ProductCoverage {
    type: string;
    url: string;
}

export interface ConsultationContact {
    name: string;
    role: string | string[]; // Support multi-role
    phone: string;
    whatsapp: string;
}

export interface ConsultationLocation {
    slug: string;
    name: string;
    contacts: ConsultationContact[];
    map?: {
        label?: string;
        embedHtml?: string; // HTML string for iframe
        embedUrl?: string; // Legacy URL
    };
}

export interface ProductConsultation {
    title: string;
    description: string;
    locations: ConsultationLocation[];
}

export interface ProductCTA {
    primaryLabel?: string; // Defaults to "Comprar en Nami"
    whatsappText?: string;
    secondaryLabel?: string; // Defaults to "Consultar disponibilidad"
}

export interface ProductBase {
    slug: string; // Runtime
    categorySlug: string; // Runtime
    categoryTitle?: string; // Optional, populated for featured products

    title: string;
    shortDescription: string;
    badge?: string;
    price?: string;
    order: number;
    isFeatured: boolean;
    isActive: boolean;

    coverage?: ProductCoverage;
    cta?: ProductCTA;

    // Content
    sections: ProductSection[];
    sectionsOrder?: string[]; // Defaults to sections array order

    // Data
    purchase?: {
        label: string;
        url: string;
    };
    consultation: ProductConsultation; // REQUIRED (Runtime resolved)
    consultationRef?: string; // Optional: Pointer to global config
    consultationOverride?: ProductConsultation; // Optional: Override global config

    // Runtime / Computed
    galleryImages?: string[];
    image?: string; // Primary image (usually galleryImages[0])

    seo?: {
        title: string;
        description: string;
    };
}

export type Product = ProductBase;


// --- CONTACT PAGE TYPES ---

export interface Contact {
    name: string;
    role: string | string[];
    phone: string;
    whatsapp: string;
}

export interface Location {
    slug: string;
    name: string;
    contacts: Contact[];
    address?: string; // Future proofing
    googleMapsUrl?: string; // Legacy/Future proofing
    coordinates?: { // Future proofing
        lat: number;
        lng: number;
    };
    map?: {
        label?: string;
        embedHtml?: string;
        googleMapsUrl?: string;
        embedUrl?: string;
    };
}

export interface ConsultationData {
    consultation: {
        title: string;
        description: string;
        locations: Location[];
    };
}

