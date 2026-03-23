import { createClient } from '@/lib/supabase/server'

/**
 * Server-side helper: returns true if the current user has 'admin' or 'staff' role.
 * Safe to call from any Server Component — returns false if not logged in.
 */
export async function getIsAdmin(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin' || profile?.role === 'staff'
}

/**
 * Server-side helper: returns true if any user session exists (regardless of role).
 */
export async function getIsLoggedIn(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
}
