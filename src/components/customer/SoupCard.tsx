'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { Plus, CheckCircle2 } from 'lucide-react'
import { MenuItem } from '@/types/database'

type SoupSize = { label: string; price: number }

export function SoupCard({ item }: { item: MenuItem }) {
    const sizes: SoupSize[] = item.metadata?.sizes ?? [{ label: 'Regular', price: item.price }]
    const [selectedSize, setSelectedSize] = useState<SoupSize>(sizes[0])
    const [added, setAdded] = useState(false)
    const addItem = useCartStore(s => s.addItem)

    const handleAdd = () => {
        if (item.is_sold_out) return
        addItem({
            id: item.id,
            name: `${item.name} (${selectedSize.label})`,
            price: selectedSize.price,
            quantity: 1,
            category: item.category,
            customizations: { size: selectedSize.label },
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
    }

    return (
        <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-2xl transition-shadow group relative overflow-hidden">
            {item.is_sold_out && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <span className="bg-white text-emerald-900 font-bold px-6 py-2 rounded-full border border-stone-200 shadow-xl rotate-[-5deg]">
                        Sold Out Today
                    </span>
                </div>
            )}
            <div className="h-48 -mt-6 -mx-6 mb-5 bg-stone-200 relative overflow-hidden flex items-center justify-center group-hover:bg-stone-300 transition-colors">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.classList.add('flex');
                        }}
                    />
                ) : (
                    <span className="text-stone-400 font-serif font-bold text-2xl uppercase tracking-widest opacity-30 select-none px-4 text-center">
                        {item.name}
                    </span>
                )}
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-serif text-emerald-900 leading-tight mb-1">{item.name}</h3>
                {item.description && <p className="text-sm text-stone-600 leading-relaxed font-medium">{item.description}</p>}
            </div>

            {/* Size selector */}
            <div className="flex gap-2 mb-4">
                {sizes.map(size => (
                    <button
                        key={size.label}
                        onClick={() => setSelectedSize(size)}
                        className={`flex-1 py-1.5 rounded-xl text-sm font-bold border transition-all min-h-[44px] ${selectedSize.label === size.label
                            ? 'bg-[#718355] text-white border-[#718355] shadow-md'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-[#718355]'
                            }`}
                    >
                        {size.label}
                        <span className="block text-xs font-semibold mt-0.5 opacity-80">${size.price.toFixed(2)}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={handleAdd}
                disabled={item.is_sold_out}
                className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all min-h-[44px] ${added
                    ? 'bg-[#718355] text-white shadow-md'
                    : item.is_sold_out
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-[#718355]/10 text-[#718355] hover:bg-[#718355] hover:text-white'
                    }`}
            >
                {added ? <><CheckCircle2 size={18} /> Added!</> : <><Plus size={18} /> Add to Order</>}
            </button>
        </div>
    )
}
