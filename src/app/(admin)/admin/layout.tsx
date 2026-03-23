import Link from 'next/link'
import { LayoutDashboard, Utensils, ClipboardList, Pencil, LogOut, Home, Info, Phone } from 'lucide-react'
import { AdminRealtimeProvider } from '@/components/admin/AdminRealtimeProvider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-stone-100">
            {/* Sidebar */}
            <aside className="w-64 bg-emerald-950 text-white flex flex-col shrink-0">
                <div className="p-6 border-b border-emerald-900">
                    <h2 className="text-xl font-bold tracking-tight">Nette&apos;s Cafe</h2>
                    <p className="text-emerald-500 text-xs font-semibold mt-0.5 uppercase tracking-widest">Management Mode</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {/* Operations */}
                    <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-emerald-500">Operations</p>
                    <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-900 transition-colors text-emerald-50">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-900 transition-colors text-emerald-50">
                        <ClipboardList size={18} /> Live Orders
                    </Link>
                    <Link href="/admin/menu-editor" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-900 transition-colors text-emerald-50">
                        <Utensils size={18} /> Menu Editor
                    </Link>

                    {/* Content Editors */}
                    <div className="pt-4 mt-4 border-t border-emerald-800">
                        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-emerald-500">Content Editors</p>
                        <Link href="/admin/home" className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-500/20 transition-colors text-yellow-300">
                            <Home size={18} /> Edit Home
                        </Link>
                        <Link href="/admin/about" className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-500/20 transition-colors text-yellow-300">
                            <Info size={18} /> Edit About
                        </Link>
                        <Link href="/admin/menu" className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-500/20 transition-colors text-yellow-300">
                            <Pencil size={18} /> Edit Menu Page
                        </Link>
                        <Link href="/admin/contact" className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-500/20 transition-colors text-yellow-300">
                            <Phone size={18} /> Edit Contact
                        </Link>
                        <Link href="/admin/pages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-500/20 transition-colors text-yellow-300">
                            <ClipboardList size={18} /> Custom Pages
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-emerald-900">
                    <form action="/auth/signout" method="post">
                        <button className="flex w-full items-center gap-3 p-3 rounded-lg hover:bg-emerald-900 transition-colors text-emerald-200">
                            <LogOut size={18} /> Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                <AdminRealtimeProvider>
                    {children}
                </AdminRealtimeProvider>
            </main>
        </div>
    )
}
