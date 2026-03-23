'use client'

import { useCartStore } from '@/lib/store/cartStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Trash2, ArrowRight, Utensils, ShoppingBag } from 'lucide-react'

export default function CheckoutPage() {
    const { items, removeItem, totalPrice, totalItems } = useCartStore()
    const [mounted, setMounted] = useState(false)
    const [orderType, setOrderType] = useState<'eat-in' | 'takeaway'>('eat-in')
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
                <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mb-6 text-stone-400">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">Your cart is empty</h2>
                <p className="text-stone-500 mb-8 max-w-md">Looks like you haven't added anything to your order yet.</p>
                <Link href="/menu/soups" className="px-8 py-4 rounded-full bg-emerald-800 text-white font-bold hover:bg-emerald-700 transition">
                    Browse Menu
                </Link>
            </div>
        )
    }

    const handleProceed = () => {
        router.push(`/checkout/payment?type=${orderType}&amount=${totalPrice()}`)
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-stone-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    <h1 className="text-4xl font-black text-emerald-950 mb-8 tracking-tight">Review Order</h1>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 mb-8 divide-y divide-stone-100">
                        {items.map((item, index) => (
                            <div key={index} className="py-6 first:pt-0 last:pb-0 flex gap-4">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-stone-900 text-lg">{item.name}</h3>
                                        <span className="font-bold text-emerald-800">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm text-stone-500 mb-3 flex items-center gap-4">
                                        <span>Qty: {item.quantity}</span>
                                        <button
                                            onClick={() => removeItem(item.id, item.customizations)}
                                            className="text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>

                                    {item.customizations && (
                                        <div className="bg-stone-50 p-3 rounded-lg text-sm">
                                            {item.customizations.base && (
                                                <p><span className="font-semibold text-stone-700">Base:</span> {item.customizations.base.name || item.customizations.base}</p>
                                            )}
                                            {item.customizations.proteins?.length > 0 && (
                                                <p><span className="font-semibold text-stone-700">Proteins:</span> {item.customizations.proteins.map((p: any) => p.name || p).join(', ')}</p>
                                            )}
                                            {item.customizations.dressings?.length > 0 && (
                                                <p><span className="font-semibold text-stone-700">Dressing:</span> {item.customizations.dressings.map((d: any) => d.name || d).join(', ')}</p>
                                            )}
                                            {item.customizations.toppings?.length > 0 && (
                                                <p><span className="font-semibold text-stone-700">Toppings:</span> {item.customizations.toppings.map((t: any) => t.name || t).join(', ')}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-96">
                    <div className="bg-emerald-950 text-white rounded-3xl p-8 sticky top-28 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="mb-8">
                            <p className="text-sm text-emerald-300 font-bold uppercase tracking-wider mb-3">Dining Preference</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setOrderType('eat-in')}
                                    className={`py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition ${orderType === 'eat-in'
                                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-emerald-950'
                                        : 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800'
                                        }`}
                                >
                                    <Utensils size={18} /> Eat-in
                                </button>
                                <button
                                    onClick={() => setOrderType('takeaway')}
                                    className={`py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition ${orderType === 'takeaway'
                                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-emerald-950'
                                        : 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800'
                                        }`}
                                >
                                    <ShoppingBag size={18} /> Takeaway
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6 pt-6 border-t border-emerald-800">
                            <span className="text-emerald-100">Total ({totalItems()} items)</span>
                            <span className="text-3xl font-black">${totalPrice().toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleProceed}
                            className="w-full bg-white text-emerald-950 py-4 rounded-xl font-bold hover:bg-emerald-50 transition shadow-lg flex items-center justify-center gap-2"
                        >
                            Proceed to Payment <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
