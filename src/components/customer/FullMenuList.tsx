'use client'

import { MenuItem } from '@/types/database'
import { AddToCartButton } from '@/components/customer/AddToCartButton'

interface FullMenuListProps {
    items: MenuItem[]
}

const CATEGORY_DISPLAY_MAP: Record<string, string> = {
    'build_bowl': 'Build Your Own Bowl',
    'build_wrap': 'Build Your Own Wrap',
    'daily_special': 'Daily Special',
    'special': 'Daily Special',
    'soup': 'Soup',
    'pastry': 'Pastries',
    'muffin': 'Pastries',
    'coffee': 'Coffee',
    'other_drinks': 'Other Drinks'
}

const CATEGORY_ORDER = [
    'build_bowl',
    'build_wrap',
    'soup',
    'daily_special',
    'pastry',
    'coffee',
    'other_drinks'
]

export default function FullMenuList({ items }: FullMenuListProps) {
    // Group items by their mapped display category
    const groupedItems: Record<string, MenuItem[]> = {}
    
    items.forEach(item => {
        const displayCategory = CATEGORY_DISPLAY_MAP[item.category] || item.category
        if (!groupedItems[displayCategory]) {
            groupedItems[displayCategory] = []
        }
        groupedItems[displayCategory].push(item)
    })

    // Sort categories based on CATEGORY_ORDER
    const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
        const indexA = CATEGORY_ORDER.indexOf(Object.keys(CATEGORY_DISPLAY_MAP).find(key => CATEGORY_DISPLAY_MAP[key] === a) || '')
        const indexB = CATEGORY_ORDER.indexOf(Object.keys(CATEGORY_DISPLAY_MAP).find(key => CATEGORY_DISPLAY_MAP[key] === b) || '')
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
    })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black text-stone-900 mb-12 text-center">Nette's Cafe Menu</h1>
            
            <div className="space-y-16">
                {sortedCategories.map(categoryName => (
                    <section key={categoryName} id={categoryName.toLowerCase().replace(/\s+/g, '-')}>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-black text-[#2D2D2D] whitespace-nowrap">{categoryName}</h2>
                            <div className="h-px bg-stone-200 w-full" />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {groupedItems[categoryName].map(item => (
                                <div 
                                    key={item.id}
                                    className="bg-white rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden"
                                >
                                    {/* Image Container */}
                                    <div className="aspect-[4/3] relative overflow-hidden bg-stone-50">
                                        <img 
                                            src={item.image_url || '/images/menu/placeholder.jpg'} 
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/menu/placeholder.jpg'
                                            }}
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-black text-[#A68A64] shadow-sm">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-serif text-[#2D2D2D] mb-2 group-hover:text-[#718355] transition-colors">
                                            {item.name}
                                        </h3>
                                        {item.description && (
                                            <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-1">
                                                {item.description}
                                            </p>
                                        )}
                                        <div className="mt-auto">
                                            <AddToCartButton item={item} disabled={!!item.is_sold_out} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}
