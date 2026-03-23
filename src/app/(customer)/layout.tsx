import { createClient } from '@/lib/supabase/server'
import { toSettingsMap, getSetting } from '@/types/database'
import CustomerShell from '@/components/customer/CustomerShell'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()

    // Fetch settings
    const { data: settingsData } = await supabase.from('site_settings').select('key, value')
    const s = toSettingsMap(settingsData ?? [])

    // Fetch custom pages for navigation
    const { data: pagesData } = await supabase
        .from('custom_pages')
        .select('id, title, slug')
        .order('created_at', { ascending: true })

    // Check if user is an admin
    const { data: { user } } = await supabase.auth.getUser()
    let isEditable = false
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'admin' || profile?.role === 'staff') {
            isEditable = true
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
            <CustomerShell
                headerData={{
                    logoText: getSetting(s, 'header_logo', "Nette's Cafe"),
                    navHome: getSetting(s, 'header_nav_home', 'Home'),
                    navAbout: getSetting(s, 'header_nav_about', 'About Us'),
                    navMenu: getSetting(s, 'header_nav_menu', 'Menu'),
                    navContact: getSetting(s, 'header_nav_contact', 'Contact'),
                    bookBtn: getSetting(s, 'header_book_btn', 'Book a Table'),
                }}
                footerData={{
                    cafeName: getSetting(s, 'footer_cafe_name', "Nette's Cafe"),
                    tagline: getSetting(s, 'footer_tagline', 'Providing nutritious, delicious meals for hospital staff, patients, and visitors.'),
                    copyright: getSetting(s, 'footer_copyright', `© ${new Date().getFullYear()} Nette's Cafe. All rights reserved.`),
                    phone: getSetting(s, 'footer_phone', '+65 8098 1919'),
                    email: getSetting(s, 'footer_email', 'hello@nettescafe.sg'),
                    address: getSetting(s, 'footer_address', '11 Jalan Tan Tock Seng #01-19, Tan Tock Seng Hospital, Singapore 308433'),
                    igHandle: getSetting(s, 'footer_ig', '@nettescafe'),
                    fbName: getSetting(s, 'footer_fb', "Nette's Cafe"),
                }}
                customPages={pagesData || []}
                isEditable={isEditable}
            >
                <main className="flex-1 flex flex-col">
                    {children}
                </main>
            </CustomerShell>
        </div>
    )
}
