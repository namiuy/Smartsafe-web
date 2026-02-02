import fs from 'fs';
import path from 'path';
import { Category, Product, ProductSection, ConsultationData, ProductConsultation } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// --- HELPERS ---

function resolveProductImageUrl(categorySlug: string, productSlug: string, index: number): string | null {
    const extensions = ['png', 'jpg', 'jpeg', 'webp'];
    const publicDir = path.join(process.cwd(), 'public');
    const relativeDir = path.join('images', 'products', categorySlug, productSlug);

    for (const ext of extensions) {
        const filename = `${index}.${ext}`;
        const filePath = path.join(publicDir, relativeDir, filename);
        if (fs.existsSync(filePath)) {
            // Return web-accessible path (always forward slashes)
            return path.join('/', relativeDir, filename).replace(/\\/g, '/');
        }
    }
    return null;
}

function normalizeCategory(raw: any, slug: string): Category {
    const rawCategory = raw as Partial<Category>;

    return {
        // Base fields
        slug, // runtime overridden
        title: rawCategory.title || "Untitled Category",
        shortDescription: rawCategory.shortDescription || "",
        order: rawCategory.order || 999,
        isActive: rawCategory.isActive ?? false, // Defaults to false if missing for safety

        // Visuals
        image: "", // Resolved dynamically if needed, or ignored
        icon: rawCategory.icon,
        logo: rawCategory.logo || `/images/products/${slug}/logo/logo.svg`,
        carrousele: rawCategory.carrousele,
        carrouselImages: rawCategory.carrouselImages, // runtime

        // Feature Flags
        enableHoverPreview: rawCategory.enableHoverPreview ?? true, // Default true per spec
        previews: rawCategory.previews, // runtime

        // SEO
        seo: {
            title: rawCategory.seo?.title || rawCategory.title || "Launch Uruguay",
            description: rawCategory.seo?.description || rawCategory.shortDescription || ""
        },

        // Extended fields (allow pass-through)
        template: rawCategory.template,
        defaultSections: rawCategory.defaultSections,
        filters: rawCategory.filters,
        tags: rawCategory.tags,

        // New Fields
        featuredHeroProductSlug: rawCategory.featuredHeroProductSlug,
        categoryBanner: rawCategory.categoryBanner
    };
}

function normalizeProduct(raw: any, categorySlug: string, productSlug: string, globalConsultation?: ProductConsultation | null): Product {
    const rawProduct = raw as Partial<Product>;

    // STRICT VALIDATION
    let consultation: ProductConsultation;

    // 1. Start with Global Default
    if (globalConsultation) {
        consultation = { ...globalConsultation };
    } else if (rawProduct.consultation) {
        // Fallback to legacy
        consultation = rawProduct.consultation;
    } else {
        throw new Error(`Product ${productSlug} in ${categorySlug} is missing required 'consultation' data.`);
    }

    // 2. Apply Overrides
    if (rawProduct.consultationOverride) {
        consultation = { ...consultation, ...rawProduct.consultationOverride };
    }

    // Dynamic Image Resolution
    // 1. Resolve Main (Index 1)
    const mainImage = resolveProductImageUrl(categorySlug, productSlug, 1);

    // 2. Resolve Gallery (Scan 1..10 or check dir)
    // We can verify presence using the same helper or just scan dir
    let galleryImages: string[] = [];
    const publicDir = path.join(process.cwd(), 'public');
    const galleryRelativePath = path.join('images', 'products', categorySlug, productSlug);
    const galleryDir = path.join(publicDir, galleryRelativePath);

    if (fs.existsSync(galleryDir)) {
        galleryImages = fs.readdirSync(galleryDir)
            .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
            .sort(new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare)
            .map(file => path.join('/', galleryRelativePath, file).replace(/\\/g, '/'));
    }

    // Fallback?
    const defaultCover = mainImage || (galleryImages.length > 0 ? galleryImages[0] : "");

    return {
        // IDs
        slug: productSlug,
        categorySlug,

        // Basic Info
        title: rawProduct.title || "Untitled Product",
        shortDescription: rawProduct.shortDescription || "",
        badge: rawProduct.badge,
        order: rawProduct.order || 999,
        isFeatured: rawProduct.isFeatured ?? false,
        isActive: rawProduct.isActive ?? false,

        // Complex Fields
        coverage: rawProduct.coverage,
        cta: {
            primaryLabel: rawProduct.cta?.primaryLabel || "Comprar en Nami",
            whatsappText: rawProduct.cta?.whatsappText,
            secondaryLabel: rawProduct.cta?.secondaryLabel || "Consultar disponibilidad",
        },

        // Content
        sections: rawProduct.sections || [],
        sectionsOrder: rawProduct.sectionsOrder || rawProduct.sections?.map(s => s.type) || [],

        // Data / Purchase
        purchase: {
            label: rawProduct.purchase?.label || "Comprar en Nami",
            url: rawProduct.purchase?.url || ""
        },
        consultation, // Resolved consultation

        // Images 
        image: defaultCover,
        galleryImages: galleryImages.length > 0 ? galleryImages : undefined,

        // SEO
        seo: {
            title: rawProduct.seo?.title || rawProduct.title || "Launch Product",
            description: rawProduct.seo?.description || rawProduct.shortDescription || ""
        }
    };
}

// --- LOADERS ---

export async function getAllCategories(): Promise<Category[]> {
    const categoriesDir = path.join(CONTENT_DIR, 'categories');

    if (!fs.existsSync(categoriesDir)) {
        return [];
    }

    // Pre-fetch global consultation to avoid reading it for every product
    const globalConsultation = await getGlobalConsultation();

    const slugs = fs.readdirSync(categoriesDir);
    const categories: Category[] = [];

    for (const slug of slugs) {
        const categoryDir = path.join(categoriesDir, slug);
        const filePath = path.join(categoryDir, 'category.json');

        if (fs.statSync(categoryDir).isDirectory() && fs.existsSync(filePath)) {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                const raw = JSON.parse(data);

                // NORMALIZE
                const category = normalizeCategory(raw, slug);

                if (category.isActive) {
                    // 1. Resolve Category Cover Image (Featured Hero Product Index 1)
                    if (category.featuredHeroProductSlug) {
                        try {
                            const heroProduct = await getProductBySlug(slug, category.featuredHeroProductSlug);
                            if (heroProduct && heroProduct.isActive) {
                                const cover = resolveProductImageUrl(slug, category.featuredHeroProductSlug, 1);
                                if (cover) category.image = cover;
                            }
                        } catch (e) {
                            console.error(`Error resolving hero product for ${slug}:`, e);
                        }
                    }

                    // Fallback using first product if not set
                    if (!category.image) {
                        const products = await getProductsByCategory(slug, globalConsultation);
                        if (products.length > 0) {
                            // assume sorted by order
                            const first = products[0]; // sorting happens in getProductsByCategory return, but here we invoke it to get list. We should verify order.
                            // Actually getProductsByCategory does return sorted.
                            if (first.image) category.image = first.image;
                        }
                    }


                    // 2. Carousel Images Discovery (Legacy/Manual)
                    if (category.carrousele) {
                        try {
                            const publicDir = path.join(process.cwd(), 'public');
                            const carouselDir = path.join(publicDir, category.carrousele);
                            if (fs.existsSync(carouselDir)) {
                                const files = fs.readdirSync(carouselDir);
                                category.carrouselImages = files
                                    .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
                                    .map(file => path.join('/', category.carrousele!, file).replace(/\\/g, '/'));
                            }
                        } catch (e) {
                            console.error(`Error loading carousel for ${slug}:`, e);
                        }
                    }


                    // 3. Hover Previews / Banner Logic
                    // Category Banner Config: { mode: "auto-from-products", imageIndex: 1, limit: 12 }
                    const bannerMode = category.categoryBanner?.mode || "auto-from-products";
                    const imageIndex = category.categoryBanner?.imageIndex || 1;
                    const limit = category.categoryBanner?.limit || 12;

                    if (category.enableHoverPreview || bannerMode === "auto-from-products") {
                        try {
                            const products = await getProductsByCategory(slug, globalConsultation);

                            // Ensure sorted by priority (Featured > Order)
                            const sorted = products.sort((a, b) => {
                                if (a.isFeatured && !b.isFeatured) return -1;
                                if (!a.isFeatured && b.isFeatured) return 1;
                                return a.order - b.order;
                            });

                            const selected = sorted.slice(0, limit);

                            // Resolve images for these products at specified index
                            category.previews = selected.map(p =>
                                resolveProductImageUrl(slug, p.slug, imageIndex) || p.image // fallback to main image if index not found
                            ).filter(Boolean) as string[];

                        } catch (e) {
                            console.error(`Error loading previews for ${slug}:`, e);
                        }
                    }

                    categories.push(category);
                }
            } catch (e) {
                console.error(`Error loading category ${slug}:`, e);
            }
        }
    }

    return categories.sort((a, b) => a.order - b.order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const filePath = path.join(CONTENT_DIR, 'categories', slug, 'category.json');
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const raw = JSON.parse(data);
        const category = normalizeCategory(raw, slug);

        // Carousel Discovery
        if (category.carrousele) {
            const publicDir = path.join(process.cwd(), 'public');
            const carouselDir = path.join(publicDir, category.carrousele);
            try {
                if (fs.existsSync(carouselDir)) {
                    const files = fs.readdirSync(carouselDir);
                    category.carrouselImages = files
                        .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
                        .map(file => path.join('/', category.carrousele!, file).replace(/\\/g, '/'));
                }
            } catch (e) {
                console.error(`Error loading carousel for ${slug}:`, e);
            }
        }

        // Hover Previews Discovery (Required for HeroCarousel on Category Page)
        if (category.enableHoverPreview) {
            try {
                const globalConsultation = await getGlobalConsultation();
                const products = await getProductsByCategory(slug, globalConsultation);
                const sorted = products.sort((a, b) => {
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    return a.order - b.order;
                });
                const top3 = sorted.slice(0, 10);
                category.previews = top3.map(p =>
                    p.image || `/images/products/${slug}/${p.slug}/1.png`
                );
            } catch (e) {
                console.error(`Error loading previews for ${slug}:`, e);
            }
        }

        return category;
    } catch (e) {
        console.error(`Error reading category ${slug}:`, e);
        return null;
    }
}

export async function getProductsByCategory(categorySlug: string, providedGlobalConsultation?: ProductConsultation | null): Promise<Product[]> {
    const productsDir = path.join(CONTENT_DIR, 'categories', categorySlug, 'products');

    if (!fs.existsSync(productsDir)) {
        return [];
    }

    // Use provided or fetch new if missing
    const globalConsultation = providedGlobalConsultation === undefined ? await getGlobalConsultation() : providedGlobalConsultation;

    let items: string[] = [];
    try {
        items = fs.readdirSync(productsDir);
    } catch (e) {
        return [];
    }

    const products: Product[] = [];

    for (const item of items) {
        const itemPath = path.join(productsDir, item);

        try {
            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                const productJsonPath = path.join(itemPath, 'product.json');
                if (fs.existsSync(productJsonPath)) {
                    const data = fs.readFileSync(productJsonPath, 'utf8');
                    const raw = JSON.parse(data);

                    // NORMALIZE
                    // Now handles dynamic image resolution
                    const product = normalizeProduct(raw, categorySlug, item, globalConsultation);

                    if (product.isActive) {
                        products.push(product);
                    }
                }
            }
        } catch (e) {
            console.error(`Error loading product ${item} in ${categorySlug}:`, e);
        }
    }

    return products.sort((a, b) => a.order - b.order);
}

export async function getProductBySlug(categorySlug: string, productSlug: string): Promise<Product | null> {
    const productDir = path.join(CONTENT_DIR, 'categories', categorySlug, 'products', productSlug);
    const filePath = path.join(productDir, 'product.json');

    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const globalConsultation = await getGlobalConsultation();
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const raw = JSON.parse(fileContent);
        const product = normalizeProduct(raw, categorySlug, productSlug, globalConsultation);

        return product;
    } catch (e) {
        console.error(`Error reading product ${productSlug}:`, e);
        return null;
    }
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const categories = await getAllCategories();
    let allFeatured: Product[] = [];

    for (const category of categories) {
        const products = await getProductsByCategory(category.slug);
        const featured = products
            .filter(p => p.isFeatured)
            .map(p => ({ ...p, categoryTitle: category.title })); // Note: categoryTitle not in Product type interface yet, might need cast or extension if used
        allFeatured = [...allFeatured, ...featured];
    }

    // Sort globally by some criteria? For now simply concat.
    return allFeatured;
}

export async function getContactData(): Promise<ConsultationData | null> {
    const filePath = path.join(CONTENT_DIR, 'contacts', 'contacts.json');

    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const contactData = JSON.parse(data);

        // Merge with global consultation data for the Contact Page
        const globalConsultation = await getGlobalConsultation();

        return {
            ...contactData,
            consultation: globalConsultation || { title: "", description: "", locations: [] }
        };
    } catch (e) {
        console.error("Error reading contact data:", e);
        return null;
    }
}

// --- GLOBAL CONSULTATION LOADER ---
export async function getGlobalConsultation(): Promise<ProductConsultation | null> {
    const filePath = path.join(CONTENT_DIR, 'company', 'launch', 'consultation.json');
    if (!fs.existsSync(filePath)) return null;
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error("Error reading global consultation:", e);
        return null;
    }
}

export async function getAccessoriesCategoryData(): Promise<{ category: Category; products: Product[] } | null> {
    const slug = 'accesorios';
    const category = await getCategoryBySlug(slug);

    if (!category) return null;

    const products = await getProductsByCategory(slug);
    const activeProducts = products.filter(p => p.isActive);

    return {
        category,
        products: activeProducts
    };
}

export async function getAceitesYFluidosData(): Promise<{ category: Category; products: Product[] } | null> {
    const slug = 'aceites-y-fluidos';
    const category = await getCategoryBySlug(slug);

    if (!category) return null;

    const products = await getProductsByCategory(slug);
    const activeProducts = products.filter(p => p.isActive);

    return {
        category,
        products: activeProducts
    };
}
