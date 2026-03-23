import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit2, ArchiveX, ArchiveRestore } from 'lucide-react'
import { toggleSoldOut } from '@/lib/actions/menuActions'

export default async function MenuEditorPage() {
    const supabase = await createClient()

    const { data: menuItems } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

    const items = menuItems || []

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-emerald-950 tracking-tight mb-2">Menu Management</h1>
                    <p className="text-stone-500 font-medium">Create, update, and manage availability of menu items.</p>
                </div>
                <Link
                    href="/admin/menu-editor/new"
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                    <Plus size={20} /> Add New Item
                </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200">
                                <th className="p-4 font-bold text-stone-600 text-sm tracking-wider uppercase">Name</th>
                                <th className="p-4 font-bold text-stone-600 text-sm tracking-wider uppercase">Category</th>
                                <th className="p-4 font-bold text-stone-600 text-sm tracking-wider uppercase">Price</th>
                                <th className="p-4 font-bold text-stone-600 text-sm tracking-wider uppercase">Status</th>
                                <th className="p-4 font-bold text-stone-600 text-sm tracking-wider uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-stone-50/50 transition">
                                    <td className="p-4 font-bold text-stone-900">{item.name}</td>
                                    <td className="p-4">
                                        <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-stone-200">
                                            {item.category.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-stone-700">${item.price.toFixed(2)}</td>
                                    <td className="p-4">
                                        {item.is_sold_out ? (
                                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">Sold Out</span>
                                        ) : (
                                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">Available</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <form action={toggleSoldOut.bind(null, item.id, item.is_sold_out)} className="inline">
                                            <button
                                                className={`p-2 rounded-lg transition ${item.is_sold_out ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                                                title={item.is_sold_out ? "Mark Available" : "Mark Sold Out"}
                                            >
                                                {item.is_sold_out ? <ArchiveRestore size={18} /> : <ArchiveX size={18} />}
                                            </button>
                                        </form>
                                        <Link
                                            href={`/admin/menu-editor/${item.id}`}
                                            className="p-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition inline-block"
                                            title="Edit Item"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-stone-500 font-medium">
                                        No menu items found. Click "Add New Item" to start building your menu.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
