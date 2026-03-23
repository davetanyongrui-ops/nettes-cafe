'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Shield, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                router.push('/admin/dashboard')
            }
        }
        checkUser()
    }, [router, supabase])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (loginError) {
            setError(loginError.message)
            setLoading(false)
        } else {
            router.push('/admin/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-stone-100 p-4 absolute inset-0 z-50">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
                <div className="bg-emerald-950 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
                    <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-800 relative z-10 shadow-lg">
                        <Shield size={32} className="text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight relative z-10">Admin & Staff Portal</h1>
                    <p className="text-emerald-300 mt-2 text-sm relative z-10">Secure access for Nette's Cafe personnel</p>
                </div>

                <form onSubmit={handleLogin} className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100 flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-stone-50 focus:bg-white"
                                placeholder="staff@nettescafe.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-stone-50 focus:bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
