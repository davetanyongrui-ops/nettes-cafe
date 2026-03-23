import { Suspense } from 'react'
import PaymentContent from './PaymentContent'
import { Loader2 } from 'lucide-react'

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="animate-spin text-emerald-600" size={48} />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    )
}
