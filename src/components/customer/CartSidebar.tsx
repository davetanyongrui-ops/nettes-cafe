'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function CartSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { items, removeItem, totalPrice, totalItems, clearCart } = useCartStore()

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                        <ShoppingBag size={22} className="text-emerald-600" /> Your Order
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-stone-100 transition text-stone-500"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center gap-4">
                            <ShoppingBag size={56} className="opacity-20" />
                            <div>
                                <p className="font-bold text-lg text-stone-600">Your cart is empty</p>
                                <p className="text-sm mt-1">Add something delicious from the menu!</p>
                            </div>
                        </div>
                    ) : (
                        items.map((item, i) => (
                            <div key={i} className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="font-bold text-stone-900 text-sm leading-tight">{item.name}</p>
                                        <p className="font-black text-emerald-700 text-sm shrink-0">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="text-xs text-stone-500 mt-0.5 mb-2">Qty: {item.quantity} · ${item.price.toFixed(2)} each</p>
                                    {item.customizations && (
                                        <div className="text-xs bg-white rounded-lg px-3 py-2 border border-stone-200 text-stone-600 space-y-0.5">
                                            {item.customizations.base && (
                                                <p><span className="font-semibold">Base:</span> {item.customizations.base.name || item.customizations.base}</p>
                                            )}
                                            {item.customizations.proteins?.length > 0 && (
                                                <p><span className="font-semibold">Protein:</span> {item.customizations.proteins.map((p: any) => p.name || p).join(', ')}</p>
                                            )}
                                            {item.customizations.dressings?.length > 0 && (
                                                <p><span className="font-semibold">Dressing:</span> {item.customizations.dressings.map((d: any) => d.name || d).join(', ')}</p>
                                            )}
                                            {item.customizations.toppings?.length > 0 && (
                                                <p><span className="font-semibold">Toppings:</span> {item.customizations.toppings.map((t: any) => t.name || t).join(', ')}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeItem(item.id, item.customizations)}
                                    className="shrink-0 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-stone-100 p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-medium">{totalItems()} item{totalItems() !== 1 ? 's' : ''}</span>
                            <button onClick={clearCart} className="text-xs text-stone-400 hover:text-red-500 transition font-semibold">
                                Clear all
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-stone-900">Total</span>
                            <span className="text-2xl font-black text-emerald-800">${totalPrice().toFixed(2)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 text-base"
                        >
                            Proceed to Checkout <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </aside>
        </>
    )
}
