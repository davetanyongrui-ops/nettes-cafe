'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { menuItemSchema, MenuItemFormValues } from '@/lib/validations/menu'
import { redirect } from 'next/navigation'

export async function createMenuItem(data: MenuItemFormValues) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const parsedData = menuItemSchema.safeParse(data)
    if (!parsedData.success) throw new Error('Invalid data')

    const { error } = await supabase.from('menu_items').insert([parsedData.data])
    if (error) throw new Error(error.message)

    revalidatePath('/', 'layout')
    redirect('/admin/menu-editor')
}

export async function updateMenuItem(id: string, data: MenuItemFormValues) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const parsedData = menuItemSchema.safeParse(data)
    if (!parsedData.success) throw new Error('Invalid data')

    const { error } = await supabase.from('menu_items').update(parsedData.data).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/', 'layout')
    redirect('/admin/menu-editor')
}

export async function deleteMenuItem(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/', 'layout')
}

export async function toggleSoldOut(id: string, currentStatus: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase.from('menu_items').update({ is_sold_out: !currentStatus }).eq('id', id)
    if (error) throw new Error(error.message)

    revalidatePath('/', 'layout')
}
