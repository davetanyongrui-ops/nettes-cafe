import { createClient } from '@/lib/supabase/server'
import FullMenuList from '@/components/customer/FullMenuList'

export default async function MenuListPage() {
    const supabase = await createClient()
    
    const { data: items } = await supabase
        .from('menu_items')
        .select('*')
        .order('category')
        .order('name')

    return (
        <div className="bg-stone-50 min-h-screen pt-24 pb-20">
            <FullMenuList items={items ?? []} />
        </div>
    )
}
