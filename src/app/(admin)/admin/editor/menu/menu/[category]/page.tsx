import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/customer/AddToCartButton'

const fallbackMenu: Record<string, any[]> = {
    soups: [
        { id: 's1', name: 'Herbal Chicken Bone Broth', description: 'Slow-simmered for 12 hours with ginseng, goji berries, and organic chicken.', price: 8.5, category: 'soup', is_sold_out: false },
        { id: 's2', name: 'Lotus Root & Pork Rib', description: 'Traditional nourishing soup to clear heat and support immunity.', price: 7.5, category: 'soup', is_sold_out: false }
    ],
    muffins: [
        { id: 'm1', name: 'Blueberry Oat Bran', description: 'High fiber, low sugar muffin made with whole grains.', price: 3.5, category: 'muffin', is_sold_out: false },
        { id: 'm2', name: 'Carrot & Walnut', description: 'Rich in beta-carotene and healthy fats.', price: 4.0, category: 'muffin', is_sold_out: true }
    ]
}

export default async function GenericMenuPage({ params }: { params: { category: string } }) {
    const category = params.category

    if (category !== 'soups' && category !== 'muffins') {
        notFound()
    }

    const dbCategory = category === 'soups' ? 'soup' : 'muffin'
    const supabase = await createClient()

    const { data: menuItems } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category', dbCategory)

    const items = menuItems && menuItems.length > 0 ? menuItems : fallbackMenu[category]

    return (
        <div className="min-h-screen bg-stone-50 py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-emerald-950 capitalize tracking-tight mb-4">
                        {category === 'soups' ? 'Nourishing Soups' : 'Healthy Muffins'}
                    </h1>
                    <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                        {category === 'soups'
                            ? 'Slow-cooked traditional broths designed to restore and rejuvenate.'
                            : 'Wholesome, low-sugar baked goods for a guilt-free treat.'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl p-8 border border-stone-100 flex flex-col justify-between hover:shadow-xl transition-shadow group relative overflow-hidden">
                            {item.is_sold_out && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                    <span className="bg-white text-stone-900 font-bold px-6 py-2 rounded-full border border-stone-200 shadow-xl rotate-[-5deg]">
                                        Sold Out Today
                                    </span>
                                </div>
                            )}
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-stone-900 leading-tight pr-4">{item.name}</h3>
                                    <span className="font-black text-emerald-800 text-xl shrink-0">${item.price.toFixed(2)}</span>
                                </div>
                                <p className="text-stone-500 mb-8 leading-relaxed">{item.description || 'Nutritious and delicious.'}</p>
                            </div>

                            <AddToCartButton item={item} disabled={item.is_sold_out} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
