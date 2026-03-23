'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import { QrCode, Upload, CheckCircle2, Loader2 } from 'lucide-react'

export default function PaymentContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { items, clearCart } = useCartStore()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)

    const amount = searchParams.get('amount')
    const orderType = searchParams.get('type') || 'eat-in'

    const [receiptFile, setReceiptFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const submitOrder = async (paymentStatus: 'pending' | 'manual_verification_required', file?: File) => {
        setIsSubmitting(true)
        const supabase = createClient()

        try {
            let receiptUrl = null

            // Upload receipt if provided
            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `receipt-${Date.now()}.${fileExt}`

                const { error: uploadError, data } = await supabase.storage
                    .from('receipts')
                    .upload(fileName, file)

                if (uploadError) {
                    console.error('Upload Error:', uploadError)
                    throw new Error('Failed to upload receipt')
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('receipts')
                    .getPublicUrl(fileName)

                receiptUrl = publicUrl
            }

            // 1. Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    order_type: orderType,
                    total_amount: Number(amount),
                    payment_status: paymentStatus,
                    status: 'pending',
                    receipt_image_url: receiptUrl
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Create order items
            const orderItems = items.map(item => ({
                order_id: order.id,
                item_name: item.name,
                category: item.category,
                quantity: item.quantity,
                unit_price: item.price,
                customizations: item.customizations || {}
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            setOrderId(order.id)
            setIsSuccess(true)
            clearCart()

            // Trigger automated WhatsApp notification (server-side bot)
            try {
                await fetch('/api/orders/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: order.id,
                        amount: amount,
                        orderType: orderType,
                        items: items
                    })
                })
            } catch (err) {
                console.error('Failed to trigger automated notification:', err)
            }

        } catch (error) {
            console.error('Checkout error:', error)
            alert('Failed to place order. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setReceiptFile(file)
            submitOrder('manual_verification_required', file)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="text-4xl font-black text-emerald-950 mb-4 tracking-tight">Order Confirmed!</h1>
                <p className="text-lg text-stone-500 mb-2">Order ID: <span className="font-mono bg-stone-200 px-3 py-1 rounded text-stone-800 font-bold">{orderId?.slice(0, 8).toUpperCase()}</span></p>
                <p className="text-stone-500 max-w-md mx-auto mb-8 font-medium">
                    We've received your order and are preparing it now. Please head to the counter when your number is called.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="px-8 py-4 rounded-full bg-emerald-800 text-white font-bold hover:bg-emerald-700 transition"
                >
                    Return to Home
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-stone-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-emerald-950 mb-4 tracking-tight">Complete Payment</h1>
                    <p className="text-lg text-stone-500">Scan the QR code to pay using PayNow.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 max-w-md mx-auto relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
                            <p className="font-bold text-stone-900 text-lg">Processing Order...</p>
                        </div>
                    )}

                    <div className="p-8 text-center bg-emerald-950 text-white">
                        <p className="text-emerald-300 font-bold uppercase tracking-wider text-sm mb-2">Amount Due</p>
                        <p className="text-5xl font-black">${Number(amount).toFixed(2)}</p>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center border-b border-stone-100 bg-stone-50/50">
                        <div className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-stone-300 shadow-sm">
                            <QrCode size={120} className="text-stone-300" />
                        </div>
                        <p className="text-stone-500 text-sm font-medium text-center">Dietary & Nutrition Services<br />UEN: 202612345H</p>
                    </div>

                    <div className="p-6 bg-white flex flex-col sm:flex-row gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSubmitting}
                            className="flex-1 bg-white border border-stone-200 text-stone-700 py-4 rounded-xl font-bold hover:bg-stone-50 transition flex items-center justify-center gap-2"
                        >
                            <Upload size={18} /> Upload Receipt
                        </button>
                        <button
                            onClick={() => submitOrder('pending')}
                            disabled={isSubmitting}
                            className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
                        >
                            Verify Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
