'use client'

import { useState } from 'react'
import { MenuItem } from '@/types/database'
import { AddToCartButton } from '@/components/customer/AddToCartButton'
import { SoupCard } from '@/components/customer/SoupCard'
import BuildYourOwnModal, { BYOIngredient } from '@/components/customer/BuildYourOwnModal'
import EditableText from '@/components/EditableText'
import { ChefHat } from 'lucide-react'

/* ─── Menu tabs ─────────────────────────────────────────────── */
const TABS = [
    { key: 'build', label: '🥗 Superfood Bowls & Wraps' },
    { key: 'soup', label: '🍲 Soups' },
    { key: 'pie', label: '🥧 Pies' },
    { key: 'muffin', label: '🧁 Muffins' },
    { key: 'pastry', label: '🥐 Pastries' },
    { key: 'coffee', label: '☕ Coffee' },
    { key: 'tea', label: '🍵 Tea' },
    { key: 'milkshakes', label: '🥤 Milkshakes' },
    { key: 'other_drinks', label: '🥤 Other Drinks' },
]

/* ─── Dietary badge colours ──────────────────────────────────── */
const DIETARY_BADGE_STYLES: Record<string, string> = {
    vegan: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'gluten-free': 'bg-amber-100 text-amber-800 border-amber-200',
    rsf: 'bg-blue-100 text-blue-800 border-blue-200',
}

const DIETARY_LABELS: Record<string, string> = {
    vegan: 'V',
    'gluten-free': 'GF',
    rsf: 'RSF',
}

function DietaryBadges({ dietary }: { dietary?: string[] }) {
    if (!dietary?.length) return null
    return (
        <div className="flex flex-wrap gap-1 mb-2">
            {dietary.map(d => {
                const key = d.toLowerCase()
                const style = DIETARY_BADGE_STYLES[key] ?? 'bg-stone-100 text-stone-600 border-stone-200'
                const label = DIETARY_LABELS[key] ?? d.toUpperCase()
                return (
                    <span
                        key={d}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border tracking-wide ${style}`}
                    >
                        {label}
                    </span>
                )
            })}
        </div>
    )
}

/* ─── Shimmer skeleton ───────────────────────────────────────── */
function MenuSkeleton() {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
                    <div className="h-48 bg-stone-200 animate-shimmer" />
                    <div className="p-6 space-y-3">
                        <div className="h-4 bg-stone-200 rounded-full w-2/3 animate-shimmer" />
                        <div className="h-3 bg-stone-200 rounded-full w-full animate-shimmer" />
                        <div className="h-3 bg-stone-200 rounded-full w-4/5 animate-shimmer" />
                        <div className="h-11 bg-stone-100 rounded-xl mt-4 animate-shimmer" />
                    </div>
                </div>
            ))}
        </div>
    )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function MenuClient({
    items,
    saladIngredients,
    title,
    subtitle,
    titleKey,
    subtitleKey,
    isEditable = false,
}: {
    items: MenuItem[]
    saladIngredients: BYOIngredient[]
    title: string
    subtitle: string
    titleKey?: string
    subtitleKey?: string
    isEditable?: boolean
}) {
    const [tab, setTab] = useState('build')
    const [byoOpen, setByoOpen] = useState(false)

    const isBuild = tab === 'build'
    const visibleItems = items.filter(i => {
        // Special mapping for categories not supported by DB constraint
        if (tab === 'coffee') return i.category === 'special' && i.name.startsWith('COFFEE: ')
        if (tab === 'tea') return i.category === 'special' && i.name.startsWith('TEA: ')
        if (tab === 'milkshakes') return i.category === 'special' && i.name.startsWith('MILKSHAKE: ')
        if (tab === 'other_drinks') return i.category === 'special' && i.name.startsWith('OTHER: ')
        if (tab === 'build') return (i.category === 'special' && i.name.startsWith('BOWL: ')) || i.category === 'wrap'
        
        // Items stored in their correct categories
        return i.category === tab
    })

    return (
        <div className="bg-stone-50 min-h-screen">
            {/* Page Header Banner */}
            <section className="bg-[#2D2D2D] py-20 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="relative max-w-3xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3">
                        {titleKey ? (
                            <EditableText
                                settingKey={titleKey}
                                initialValue={title}
                                className="text-5xl md:text-6xl font-black tracking-tight text-white"
                                wrapperClassName="w-full"
                                isEditable={isEditable}
                            />
                        ) : title}
                    </h1>
                    <p className="text-stone-300 text-lg font-medium">
                        {subtitleKey ? (
                            <EditableText
                                settingKey={subtitleKey}
                                initialValue={subtitle}
                                className="text-stone-300 text-lg font-medium"
                                wrapperClassName="w-full"
                                isEditable={isEditable}
                            />
                        ) : subtitle}
                    </p>
                </div>
            </section>

            {/* Sticky Tab Bar */}
            <div className="sticky top-[70px] z-40 bg-white border-b border-stone-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none">
                    <div className="flex gap-1 py-3 min-w-max">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap min-h-[44px] ${tab === t.key
                                    ? 'bg-[#718355] text-white shadow-md shadow-[#718355]/25'
                                    : 'text-stone-600 hover:bg-stone-100'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                {/* ── Build Your Own / Superfood Bowls tab ── */}
                {isBuild ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                        <div className="w-24 h-24 bg-[#718355]/10 rounded-3xl flex items-center justify-center">
                            <ChefHat size={48} className="text-[#718355]" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-stone-900 mb-2">
                                <EditableText settingKey="menu_byo_title"
                                    initialValue="Build Your Superfood Bowl"
                                    className="text-3xl font-black text-stone-900"
                                    wrapperClassName="w-full" isEditable={isEditable} />
                            </h2>
                            <p className="text-stone-500 max-w-sm mx-auto">
                                <EditableText settingKey="menu_byo_desc"
                                    initialValue="Choose your base, protein, up to 6 toppings, and a dressing. We'll build it fresh for you."
                                    as="textarea" className="text-stone-500"
                                    wrapperClassName="max-w-sm w-full" isEditable={isEditable} />
                            </p>
                        </div>
                        <button
                            onClick={() => setByoOpen(true)}
                            className="px-10 py-4 bg-[#718355] text-white text-lg font-bold rounded-full hover:bg-[#5a6b44] transition shadow-lg shadow-[#718355]/20 min-h-[44px]"
                        >
                            <EditableText settingKey="menu_byo_btn"
                                initialValue="Start Building"
                                className="font-bold text-white" isEditable={isEditable} />
                        </button>
                    </div>
                ) : (
                    /* ── Standard grid ── */
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleItems.length === 0 ? (
                            /* ── Empty state ── */
                            <div className="col-span-full min-h-[300px] flex flex-col items-center justify-center text-center gap-3">
                                <p className="text-xl font-semibold text-stone-600">No items in this category yet</p>
                                <p className="text-sm text-stone-400">Add items in Admin → Menu Editor</p>
                            </div>
                        ) : (
                            visibleItems.map(item =>
                                item.category === 'soup' && item.metadata?.sizes ? (
                                    <SoupCard key={item.id} item={item} />
                                ) : (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow group relative overflow-hidden"
                                    >
                                        {item.is_sold_out && (
                                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                                <span className="bg-white text-stone-800 font-bold px-6 py-2 rounded-full border border-stone-200 shadow-xl rotate-[-5deg]">
                                                    Sold Out Today
                                                </span>
                                            </div>
                                        )}
                                        <div className="h-48 bg-stone-100 relative overflow-hidden flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-stone-400 font-serif font-bold text-2xl uppercase tracking-widest opacity-30 select-none px-4 text-center">
                                                    {item.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1 justify-between">
                                            <div className="mb-4">
                                                <DietaryBadges dietary={item.metadata?.dietary} />
                                                <div className="flex justify-between items-start gap-3 mb-2">
                                                    <h3 className="text-xl font-serif text-[#2D2D2D] leading-tight">
                                                        {item.name.replace(/^(COFFEE: |TEA: |MILKSHAKE: |OTHER: |BOWL: |WRAP: )/, '')}
                                                    </h3>
                                                    <span className="font-black text-[#A68A64] shrink-0">${item.price.toFixed(2)}</span>
                                                </div>
                                                {item.description && (
                                                    <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
                                                )}
                                            </div>
                                            <AddToCartButton item={item} disabled={item.is_sold_out} />
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Build Your Own Modal */}
            <BuildYourOwnModal
                open={byoOpen}
                onClose={() => setByoOpen(false)}
                ingredients={saladIngredients}
            />
        </div>
    )
}
