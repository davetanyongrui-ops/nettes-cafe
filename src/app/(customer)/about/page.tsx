import AboutView from '@/components/views/AboutView'
import { createClient } from '@/lib/supabase/server'
import { toSettingsMap } from '@/types/database'

export default async function AboutPage() {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    const s = toSettingsMap(data ?? [])

    return <AboutView settings={s} isEditable={false} />
}
