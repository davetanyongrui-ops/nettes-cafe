import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { toSettingsMap, getSetting } from '@/types/database'
import EditableText from '@/components/EditableText'
import HomeViewClient from '@/components/customer/HomePageContent'

type Props = { isEditable?: boolean }

export default async function HomeView({ isEditable = false }: Props) {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    const s = toSettingsMap(data ?? [])

    const content = {
        tagline: getSetting(s, 'cafe_tagline', 'Healing Broths & Farm-Fresh Nutrition'),
        heroTitle: getSetting(s, 'home_hero_title', 'Healing Broths & Nature-Inspired Nutrition.'),
        heroSubtitle: getSetting(s, 'home_hero_subtitle', 'Farm-fresh ingredients crafted for your wellbeing, right in the heart of TTSH.'),
        ctaButton: getSetting(s, 'home_cta_button', 'Order Now'),
        ourStoryBtn: getSetting(s, 'home_our_story_btn', 'Book a Table'),
        featuresHeading: getSetting(s, 'home_features_heading', 'The Health Hub'),
        featuresSubtitle: getSetting(s, 'home_features_subtitle', 'Where mindful eating meets unforgettable flavour.'),
        feature1Title: getSetting(s, 'home_feature1_title', 'Slow-Simmered Excellence'),
        feature1Desc: getSetting(s, 'home_feature1_desc', 'Our signature broths are simmered for 24 hours to extract maximum collagen and nutrient density. We source from local farms to ensure every bowl supports your recovery and vitality.'),
        feature2Title: getSetting(s, 'home_feature2_title', 'Nourishment by Design'),
        feature2Desc: getSetting(s, 'home_feature2_desc', 'Anti-inflammatory ingredients chosen to reduce stress on the body. Zero refined sugars — naturally sweetened with whole fruits and roots. Gluten-free friendly options for sensitive digestive systems.'),
        ctaTitle: getSetting(s, 'home_cta_title', 'Ready to eat well?'),
        ctaSubtitle: getSetting(s, 'home_cta_subtitle', 'Choose eat-in or takeaway. Every meal, made with intention.'),
        startOrderBtn: getSetting(s, 'home_start_order_btn', 'Order Now'),
    }

    return <HomeViewClient content={content} isEditable={isEditable} />
}
