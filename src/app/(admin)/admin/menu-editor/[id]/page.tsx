import { createClient } from '@/lib/supabase/server'
import MenuItemForm from '@/components/admin/forms/MenuItemForm'
import { notFound } from 'next/navigation'
import { deleteMenuItem } from '@/lib/actions/menuActions'
import { Trash2 } from 'lucide-react'

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: item } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single()

    if (!item) {
        notFound()
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8 max-w-2xl">
                <div>
                    <h1 className="text-3xl font-black text-emerald-950 tracking-tight mb-2">Edit Item</h1>
                    <p className="text-stone-500 font-medium">Update details for {item.name}.</p>
                </div>
                <form action={deleteMenuItem.bind(null, item.id)}>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition flex items-center gap-2 text-sm"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </form>
            </div>
            <MenuItemForm initialData={item} />
        </div>
    )
}
