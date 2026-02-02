import React from 'react';
import { ProductSection, ListSection, TextSection, BadgeSection } from '@/lib/types';
import { CheckCircle2, ChevronRight, Settings, Wrench, Shield, Zap, FileText } from 'lucide-react';

// Maps section types to icons
const SectionIconMap: Record<string, React.ElementType> = {
    highlights: Zap,
    compatibility: CheckCircle2,
    specs: Settings,
    functions: Wrench,
    included: FileText,
    safety: Shield,
};

interface ProductSectionsProps {
    sections: ProductSection[];
    className?: string;
}

export function ProductSections({ sections, className = "" }: ProductSectionsProps) {
    if (!sections || sections.length === 0) return null;

    return (
        <div className={`space-y-12 ${className}`}>
            {sections.map((section, idx) => {
                const Icon = SectionIconMap[section.type] || ChevronRight;

                return (
                    <div key={`${section.type}-${idx}`} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 text-white rounded-lg bg-[#C40000] flex items-center justify-center shadow-lg shadow-[#C40000]/20">
                                <Icon size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white capitalize font-[family-name:var(--font-space-grotesk)]">
                                {section.title || section.type}
                            </h3>
                        </div>

                        {/* RENDER BY TYPE */}

                        {/* 1. LIST TYPE (Highlights, Compatibility, Functions, etc.) */}
                        {'items' in section && Array.isArray((section as ListSection).items) && typeof (section as ListSection).items[0] === 'string' && (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(section as ListSection).items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C40000] group-hover:scale-150 transition-transform" />
                                        <span className="text-zinc-300 leading-relaxed group-hover:text-white transition-colors">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* 2. TEXT TYPE (Notes, Description, etc.) */}
                        {'text' in section && (
                            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed">
                                <p>{(section as TextSection).text}</p>
                            </div>
                        )}

                        {/* 3. KEY-VAL TYPE (Specs) */}
                        {'items' in section && Array.isArray((section as BadgeSection).items) && typeof (section as BadgeSection).items[0] === 'object' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(section as BadgeSection).items.map((item, i) => (
                                    <div key={i} className="flex flex-col p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                        <span className="text-xs font-semibold text-[#db312a] uppercase tracking-wider mb-1">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-medium text-white">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
