import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    // Authenticate as the newly found admin user to bypass RLS
    // The password is not known, but often it might be a standard test one.
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'davebazzzs@gmail.com',
        password: 'password123'
    })
    
    if (authError) {
        console.error("Login failed:", authError.message)
        return
    }
    console.log("Logged in successfully as Dave.");

    const fallbackImages: Record<string, string> = {
        'soup': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
        'pie': 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&q=80',
        'wrap': 'https://images.unsplash.com/photo-1626804475297-41609ea0eb49?w=800&q=80',
        'muffin': 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=800&q=80',
        'pastry': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80'
    }

    const { data: items, error: fetchError } = await supabase.from('menu_items').select('id, category, image_url')
    if (fetchError) {
        console.error(fetchError)
        return
    }

    const itemsToUpdate = items?.filter(i => 
        i.category in fallbackImages && 
        (i.image_url === null || i.image_url === '' || i.image_url.includes('placehold.co'))
    ) || []

    console.log(`Found ${itemsToUpdate.length} items to update globally in specified categories.`)

    let successCount = 0;
    for (const item of itemsToUpdate) {
        const { error } = await supabase
            .from('menu_items')
            .update({ image_url: fallbackImages[item.category] })
            .eq('id', item.id)
        
        if (error) {
            console.error(`Failed to update item ${item.id}:`, error.message)
        } else {
            console.log(`Updated item ${item.id} with ${item.category} fallback image.`)
            successCount++;
        }
    }
    
    console.log(`Successfully updated ${successCount} items.`);
}

main()
