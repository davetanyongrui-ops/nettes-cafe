'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSiteSetting(key: string, value: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' })

    if (error) throw new Error(error.message)

    // Revalidate all pages so changes appear immediately
    revalidatePath('/', 'layout')
}
