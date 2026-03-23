import SaladBuilder from '@/components/customer/SaladBuilder'
import { createClient } from '@/lib/supabase/server'
import { Ingredient } from '@/components/customer/SaladBuilder'

const fallbackIngredients: Ingredient[] = [
    { id: '1', name: 'Mixed Greens', price: 0, is_sold_out: false, category: 'salad_base' },
    { id: '2', name: 'Quinoa & Kale', price: 1.5, is_sold_out: false, category: 'salad_base' },
    { id: '3', name: 'Brown Rice', price: 1.0, is_sold_out: false, category: 'salad_base' },
    { id: '4', name: 'Grilled Chicken', price: 3.5, is_sold_out: false, category: 'salad_protein' },
    { id: '5', name: 'Baked Salmon', price: 4.5, is_sold_out: false, category: 'salad_protein' },
    { id: '6', name: 'Organic Tofu', price: 2.5, is_sold_out: false, category: 'salad_protein' },
    { id: '7', name: 'Sesame Ginger', price: 0, is_sold_out: false, category: 'salad_dressing' },
    { id: '8', name: 'Olive Oil & Lemon', price: 0, is_sold_out: false, category: 'salad_dressing' },
    { id: '9', name: 'Cherry Tomatoes', price: 0.5, is_sold_out: false, category: 'salad_topping' },
    { id: '10', name: 'Edamame', price: 0.5, is_sold_out: false, category: 'salad_topping' },
    { id: '11', name: 'Roasted Almonds', price: 1.0, is_sold_out: true, category: 'salad_topping' },
]

export default async function SaladBarPage() {
    const supabase = await createClient()

    // Try to fetch from Supabase
    const { data: menuItems, error } = await supabase
        .from('menu_items')
        .select('*')
        .in('category', ['salad_base', 'salad_protein', 'salad_dressing', 'salad_topping'])

    // If no DB data is available (user hasn't created items yet), use fallback
    const ingredients = menuItems && menuItems.length > 0 ? menuItems : fallbackIngredients

    return (
        <div className="bg-stone-50 py-12">
            <SaladBuilder availableIngredients={ingredients} />
        </div>
    )
}
