import { createClient } from '@/lib/supabase/server'
import { toSettingsMap, getSetting } from '@/types/database'
import MenuClient from '@/components/customer/MenuTabs'

const SALAD_CATEGORIES = ['salad_base', 'salad_protein', 'salad_dressing', 'salad_topping']

export default async function AdminMenuLiveEditorPage() {
    const supabase = await createClient()

    const [{ data: settingsRows }, { data: menuRows }, { data: saladRows }] = await Promise.all([
        supabase.from('site_settings').select('key, value'),
        supabase.from('menu_items').select('*')
            .not('category', 'in', `(${SALAD_CATEGORIES.join(',')})`)
            .order('category').order('name'),
        supabase.from('menu_items').select('*').in('category', SALAD_CATEGORIES),
    ])

    const s = toSettingsMap(settingsRows ?? [])

    return (
        <MenuClient
            items={menuRows ?? []}
            saladIngredients={saladRows ?? []}
            title={getSetting(s, 'menu_title', 'Our Menu')}
            subtitle={getSetting(s, 'menu_subtitle', 'Made fresh daily. Order eat-in or takeaway.')}
            titleKey="menu_title"
            subtitleKey="menu_subtitle"
        />
    )
}
