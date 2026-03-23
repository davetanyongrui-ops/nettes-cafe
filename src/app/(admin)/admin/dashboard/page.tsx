import { createClient } from '@/lib/supabase/server'
import { DollarSign, ShoppingBag, Utensils, TrendingUp, CalendarDays, CalendarRange } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // ── Date boundaries ──────────────────────────────────────────
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // ── Queries (parallel) ───────────────────────────────────────
    const [pendingRes, todayRes, monthRes, allTimeRes] = await Promise.all([
        // Pending orders count
        supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),

        // Today's completed revenue
        supabase
            .from('orders')
            .select('total_amount')
            .eq('status', 'completed')
            .gte('created_at', todayStart),

        // This month's completed revenue
        supabase
            .from('orders')
            .select('total_amount')
            .eq('status', 'completed')
            .gte('created_at', monthStart),

        // All-time completed orders count
        supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed'),
    ])

    const pendingOrders = pendingRes.error ? 0 : (pendingRes.count || 0)
    const todayRevenue = (todayRes.data || []).reduce((a, o) => a + Number(o.total_amount), 0)
    const monthRevenue = (monthRes.data || []).reduce((a, o) => a + Number(o.total_amount), 0)
    const completedTotal = allTimeRes.error ? 0 : (allTimeRes.count || 0)

    // Current month name
    const monthName = now.toLocaleString('en-US', { month: 'long' })

    // Greeting based on hour
    const hour = now.getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

    return (
        <div>
            <h1 className="text-3xl font-black text-emerald-950 tracking-tight mb-8">{greeting}, Admin 👋</h1>

            {/* ── Stats Grid ─────────────────────────────────────────── */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                {/* Pending Orders */}
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-start justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">Pending Orders</p>
                        <p className="text-4xl font-black text-stone-900">{pendingOrders}</p>
                    </div>
                    <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-200">
                        <ShoppingBag size={28} />
                    </div>
                </div>

                {/* Today's Revenue */}
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-start justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">Today's Revenue</p>
                        <p className="text-4xl font-black text-emerald-700">${todayRevenue.toFixed(2)}</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-200">
                        <CalendarDays size={28} />
                    </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-start justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">{monthName} Revenue</p>
                        <p className="text-4xl font-black text-stone-900">${monthRevenue.toFixed(2)}</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-200">
                        <CalendarRange size={28} />
                    </div>
                </div>

                {/* Completed Orders (all-time) */}
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-start justify-between hover:shadow-md transition">
                    <div>
                        <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">Orders Completed</p>
                        <p className="text-4xl font-black text-stone-900">{completedTotal}</p>
                    </div>
                    <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center border border-violet-200">
                        <TrendingUp size={28} />
                    </div>
                </div>
            </div>

            {/* ── Quick Access Cards ──────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/10 hover:-translate-y-1 transition duration-300">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Live Orders Monitor</h3>
                        <p className="text-emerald-300 mb-8 max-w-xs leading-relaxed font-medium">Manage the kitchen queue, update order statuses, and track pending takeaways.</p>
                        <Link href="/admin/orders" className="bg-white text-emerald-950 px-8 py-4 rounded-xl font-bold inline-block hover:bg-emerald-50 shadow-xl transition active:scale-95">
                            Open Kanban Board
                        </Link>
                    </div>
                    <Utensils className="absolute -right-12 -bottom-12 text-emerald-900 select-none opacity-40 mix-blend-screen" size={220} />
                </div>

                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">Menu Management</h3>
                    <p className="text-stone-500 mb-8 max-w-sm leading-relaxed">Instantly toggle items as Sold Out, adjust prices, or add new healthy seasonal items.</p>
                    <Link href="/admin/menu-editor" className="bg-emerald-50 text-emerald-800 px-8 py-4 rounded-xl font-bold inline-block hover:bg-emerald-100 transition border border-emerald-100 active:scale-95">
                        Edit Menu Items
                    </Link>
                </div>
            </div>
        </div>
    )
}
