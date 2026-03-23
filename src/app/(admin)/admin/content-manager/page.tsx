import { createClient } from '@/lib/supabase/server'
import ContentManagerClient from '@/components/admin/ContentManagerClient'

// These are the editable sections and their keys, in display order
const SECTIONS = [
    {
        title: 'Header / Navigation',
        keys: [
            { key: 'header_logo', label: 'Logo Text' },
            { key: 'header_nav_home', label: 'Nav: Home' },
            { key: 'header_nav_about', label: 'Nav: About' },
            { key: 'header_nav_menu', label: 'Nav: Menu' },
            { key: 'header_nav_contact', label: 'Nav: Contact' },
            { key: 'header_book_btn', label: 'Book a Table Button' },
        ],
    },
    {
        title: 'Home Page',
        keys: [
            { key: 'cafe_name', label: 'Cafe Name' },
            { key: 'cafe_tagline', label: 'Badge / Tagline' },
            { key: 'home_hero_title', label: 'Hero Title', hint: 'Use \\n for a line break after the comma' },
            { key: 'home_hero_subtitle', label: 'Hero Subtitle', multiline: true },
            { key: 'home_cta_button', label: 'Hero CTA Button Text' },
            { key: 'home_feature1_title', label: 'Feature 1 — Title' },
            { key: 'home_feature1_desc', label: 'Feature 1 — Description', multiline: true },
            { key: 'home_feature2_title', label: 'Feature 2 — Title' },
            { key: 'home_feature2_desc', label: 'Feature 2 — Description', multiline: true },
            { key: 'home_feature3_title', label: 'Feature 3 — Title' },
            { key: 'home_feature3_desc', label: 'Feature 3 — Description', multiline: true },
            { key: 'home_cta_title', label: 'Bottom CTA — Title' },
            { key: 'home_cta_subtitle', label: 'Bottom CTA — Subtitle', multiline: true },
        ],
    },
    {
        title: 'About Us Page',
        keys: [
            { key: 'about_hero_tag', label: 'Tag Label (e.g. "Our Story")' },
            { key: 'about_hero_title', label: 'Hero Title' },
            { key: 'about_intro', label: 'Intro Paragraph', multiline: true },
            { key: 'about_mission_title', label: 'Mission Title' },
            { key: 'about_mission_body', label: 'Mission Body', multiline: true },
            { key: 'about_values', label: 'Values (pipe-separated)', hint: 'e.g. Fresh & Local|Zero Cream|Salad Bar' },
        ],
    },
    {
        title: 'Menu Page',
        keys: [
            { key: 'menu_title', label: 'Page Title' },
            { key: 'menu_subtitle', label: 'Page Subtitle' },
        ],
    },
    {
        title: 'Contact Us Page',
        keys: [
            { key: 'contact_title', label: 'Page Title' },
            { key: 'contact_subtitle', label: 'Page Subtitle', multiline: true },
            { key: 'contact_address', label: 'Address' },
            { key: 'contact_phone', label: 'Phone Number' },
            { key: 'contact_email', label: 'Email Address' },
            { key: 'contact_hours_weekday', label: 'Hours (Mon–Fri)' },
            { key: 'contact_hours_weekend', label: 'Hours (Sat–Sun)' },
        ],
    },
    {
        title: 'Footer',
        keys: [
            { key: 'footer_cafe_name', label: 'Footer Cafe Name' },
            { key: 'footer_tagline', label: 'Footer Tagline', multiline: true },
            { key: 'footer_copyright', label: 'Copyright Text' },
            { key: 'footer_phone', label: 'Phone Number' },
            { key: 'footer_email', label: 'Email Address' },
            { key: 'footer_address', label: 'Physical Address', multiline: true },
            { key: 'footer_ig', label: 'Instagram Handle' },
            { key: 'footer_fb', label: 'Facebook Name' },
        ],
    },
]

export default async function ContentManagerPage() {
    const supabase = await createClient()
    const { data: rows } = await supabase.from('site_settings').select('key, value')

    // Build a flat k→v map for all current DB values
    const currentValues: Record<string, string> = {}
    rows?.forEach(r => { currentValues[r.key] = r.value })

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-emerald-950 tracking-tight mb-2">Content Manager</h1>
                <p className="text-stone-500 font-medium">
                    Edit every text element on the website. All changes go live instantly on save.
                </p>
            </div>
            <ContentManagerClient sections={SECTIONS} currentValues={currentValues} />
        </div>
    )
}
