'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'

export function CartButton() {
    const totalItems = useCartStore((state) => state.totalItems())
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Link href="/checkout" className="text-sm font-bold text-emerald-800 bg-emerald-100/50 hover:bg-emerald-100 px-6 py-2.5 rounded-full transition-all flex items-center gap-2 pointer-events-none opacity-50">
                <ShoppingBag size={18} />
                Cart (0)
            </Link>
        )
    }

    return (
        <Link href="/checkout" className="text-sm font-bold text-emerald-800 bg-emerald-100/50 hover:bg-emerald-100 px-6 py-2.5 rounded-full transition-all flex items-center gap-2">
            <ShoppingBag size={18} />
            Cart ({totalItems})
        </Link>
    )
}
