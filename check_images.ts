import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    const { data: items, error } = await supabase.from('menu_items').select('id, name, category, image_url')
    if (error) {
        console.error(error)
        return
    }
    console.log(JSON.stringify(items, null, 2))
}

main()
