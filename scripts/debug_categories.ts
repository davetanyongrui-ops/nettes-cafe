import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const CATEGORIES = [
    'soup', 'muffin', 'pie', 'wrap', 'special', 'pastry', 
    'salad_base', 'salad_protein', 'salad_dressing', 'salad_topping', 
    'coffee', 'other_drinks', 'build_bowl', 'build_wrap', 'daily_special'
]

async function main() {
    await supabase.auth.signInWithPassword({
        email: 'davebazzzs@gmail.com',
        password: '@12345'
    })

    for (const cat of CATEGORIES) {
        console.log(`Testing category: ${cat}`)
        const { error } = await supabase.from('menu_items').insert({
            name: `Test ${cat}`,
            category: cat,
            price: 0
        })
        if (error) {
            console.error(`  FAIL: ${error.message}`)
        } else {
            console.log(`  SUCCESS`)
            // Cleanup
            await supabase.from('menu_items').delete().eq('name', `Test ${cat}`)
        }
    }
}

main()
