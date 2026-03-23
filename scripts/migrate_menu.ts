import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const MENU_ITEMS = [
    // Build your own
    { name: "BOWL: Build your own Bowl", category: "special", price: 11.90, description: "Craft your perfect salad bowl with a fresh base, 4 toppings, 1 protein, 1 dressing, and a crunchy finish. Customize with more toppings for a personalised, mouthwatering meal!", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/820a1686-614c-462c-8a92-2db42b38afee.jpg?channel=online-restaurant" },
    { name: "Build your own Wrap", category: "wrap", price: 11.00, description: "Create your own wrap with our fresh toppings and proteins on our tortilla wraps! Mix and match to your taste and enjoy a delicious, customised meal made just for you.", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/97d34aa6-5332-11ef-adf7-0242ac110003.jpeg?channel=online-restaurant" },
    { name: "DAILY SPECIAL", category: "special", price: 7.90, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/7c68edcc-5402-11ef-afdb-0242ac110002.jpeg?channel=online-restaurant" },
    // Soups
    { name: "Regular Soup (Staff)", category: "soup", price: 5.50, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/919caaf0-c5b8-41ed-a12b-9b5128d19656.jpg?channel=online-restaurant" },
    { name: "Small Soup (Staff)", category: "soup", price: 3.50, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/919caaf0-c5b8-41ed-a12b-9b5128d19656.jpg?channel=online-restaurant" },
    // Pies
    { name: "American Beef Pie", category: "pie", price: 11.90, description: "Hearty beef chunks in a savory gravy, encased in a flaky pastry. Savor it with a fresh side salad.", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/dfe14cb6-3326-4c55-b5a8-5e54134e5856.jpg?channel=online-restaurant" },
    { name: "Chicken Pot Pie", category: "pie", price: 11.50, description: "Tender chicken chunks with vegetables in a creamy sauce, topped with a golden pastry crust. Includes a fresh side salad.", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/20e899e5-dd15-4512-9d8e-bb659e4b04db.jpg?channel=online-restaurant" },
    { name: "Chilli Crab Pot Pie", category: "pie", price: 11.90, description: "A local favorite! Succulent crab meat in a spicy, tangy sauce, under a buttery crust. Served with a side salad.", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/2fcb6201-bdbc-46c9-9d54-a9e96104db63.jpg?channel=online-restaurant" },
    { name: "Beef Rendang Pie", category: "pie", price: 11.90, description: "Savor Singapore's rich flavor with our Beef Rendang Pot Pie! Infused with spices and tender beef, it's a gourmet treat. Plus, enjoy a fresh side salad.", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/f49742d6-0308-4a6f-8eef-22411d541e9e.jpg?channel=online-restaurant" },
    // Coffee
    { name: "COFFEE: Latte", category: "special", price: 7.00, description: "", image_url: "" },
    { name: "COFFEE: Flat White", category: "special", price: 7.00, description: "", image_url: "" },
    { name: "COFFEE: Mocha", category: "special", price: 7.50, description: "", image_url: "" },
    { name: "COFFEE: Long Black/Americano", category: "special", price: 6.00, description: "", image_url: "" },
    { name: "COFFEE: Cappuccino", category: "special", price: 7.00, description: "", image_url: "" },
    { name: "COFFEE: Espresso (Double Shot)", category: "special", price: 5.50, description: "", image_url: "" },
    { name: "COFFEE: Caramel Macchiato", category: "special", price: 7.50, description: "", image_url: "" },
    { name: "COFFEE: Espresso Tonic", category: "special", price: 6.50, description: "", image_url: "" },
    // Tea
    { name: "TEA: Chai Latte", category: "special", price: 6.90, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/bfd77870-5408-11ef-9a7b-0242ac110003.jpeg?channel=online-restaurant" },
    { name: "TEA: Matcha Latte", category: "special", price: 7.00, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/b23c571c-5408-11ef-a492-0242ac110004.jpeg?channel=online-restaurant" },
    { name: "TEA: Dirty Matcha", category: "special", price: 7.50, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/e7caa172-7c3f-4f0e-8950-bac33bafee87.jpg?channel=online-restaurant" },
    { name: "TEA: Dirty Chai", category: "special", price: 7.50, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/a2f341c6-5408-11ef-9b43-0242ac110002.jpeg?channel=online-restaurant" },
    { name: "TEA: Brewed Tea", category: "special", price: 4.50, description: "Discover our premium brewed teas, expertly selected to elevate your tea experience with every luxurious sip.", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/a53582ff-2bf7-4af9-8714-44eef763e218.jpg?channel=online-restaurant" },
    { name: "TEA: Iced Lemon Tea", category: "special", price: 3.00, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/a1e6ff22-5406-11ef-910a-0242ac110003.jpeg?channel=online-restaurant" },
    // Milkshakes
    { name: "MILKSHAKE: Chocolate Milkshake", category: "special", price: 8.50, description: "", image_url: "" },
    { name: "MILKSHAKE: Vanilla Milkshake", category: "special", price: 7.90, description: "", image_url: "" },
    { name: "MILKSHAKE: Chai Milkshake", category: "special", price: 8.50, description: "", image_url: "" },
    { name: "MILKSHAKE: Matcha Milkshake", category: "special", price: 8.50, description: "", image_url: "" },
    { name: "MILKSHAKE: Avocado Milkshake", category: "special", price: 8.50, description: "", image_url: "" },
    { name: "MILKSHAKE: Milo Milkshake", category: "special", price: 8.50, description: "", image_url: "" },
    { name: "MILKSHAKE: Oreo Milkshake", category: "special", price: 8.50, description: "", image_url: "" },
    // Other Drinks
    { name: "OTHER: Hot Chocolate", category: "special", price: 6.90, description: "Sugar-free and sweetened with pure fruit extracts—enjoy this chocolate delight hot or cold!", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/c8b63feb-3fef-4133-876f-41a3a15777aa.jpg?channel=online-restaurant" },
    { name: "OTHER: Honey Lemon", category: "special", price: 3.90, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/3b8a45b5-d920-48ff-9803-4b0a979ae504.jpg?channel=online-restaurant" },
    { name: "OTHER: Ribena", category: "special", price: 3.00, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/3c11d5a4-38ad-43fc-8324-ef86bb92b7dd.jpg?channel=online-restaurant" },
    { name: "OTHER: Milo", category: "special", price: 3.90, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/ef55e877-9b9e-4dd7-adda-5eda7d30bbc6_knSTMMF.jpg?channel=online-restaurant" },
    { name: "OTHER: Water", category: "special", price: 3.00, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/ce1cad84-5407-11ef-a751-0242ac110002.jpeg?channel=online-restaurant" },
    { name: "OTHER: Citron Yuzu Spritz", category: "special", price: 7.00, description: "A light fizzy drink made with Korean citron & yuzu honey.", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/a70fcb2c-5407-11ef-910a-0242ac110003.jpeg?channel=online-restaurant" },
    // Pastries
    { name: "Raisin Scone", category: "pastry", price: 5.20, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/873408b2-f2c3-4347-9d4e-868cdec9cbc0.jpg?channel=online-restaurant" },
    { name: "Cheese & Jalapeno Brezel", category: "pastry", price: 5.20, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/e592942a-beff-468e-859c-54533b6ad353.jpg?channel=online-restaurant" },
    { name: "Cinnamon Swirl", category: "pastry", price: 5.50, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/3959f628-5404-11ef-a539-0242ac110002.jpeg?channel=online-restaurant" },
    { name: "Raisin Swirl", category: "pastry", price: 5.50, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/2e97b22a-5404-11ef-869a-0242ac110002.jpeg?channel=online-restaurant" },
    { name: "Plain Butter Croissant", category: "pastry", price: 4.50, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/4299d050-5404-11ef-8be4-0242ac110003.jpeg?channel=online-restaurant" },
    { name: "Chocolate Croissant", category: "pastry", price: 5.50, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/330e3edc-dfc6-4541-bed5-191d8136dcfa.jpg?channel=online-restaurant" },
    // Muffins
    { name: "Earl Grey Raisin Muffin", category: "muffin", price: 6.90, description: "", image_url: "" },
    { name: "Cranberry Salted Caramel Muffin", category: "muffin", price: 6.90, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/a8731c79-b5a6-4f79-9486-a07666b693c6.jpg?channel=online-restaurant" },
    { name: "Maple Walnut Muffin", category: "muffin", price: 6.90, description: "", image_url: "https://s3-ap-northeast-1.amazonaws.com/ichef-images/ede0d0f8-2527-4092-a084-3cdda1474ac7/online_restaurant_default/6d0bf2bf-ae3b-419b-bac6-eb26dd17d343.jpg?channel=online-restaurant" },
    { name: "Double Chocolate Muffin", category: "muffin", price: 6.90, description: "", image_url: "" },
    { name: "Vanilla Apple Muffin", category: "muffin", price: 6.90, description: "", image_url: "" },
    { name: "Blueberry & Cheese Muffin", category: "muffin", price: 6.90, description: "", image_url: "" },
    { name: "Lemon Yuzu Muffin", category: "muffin", price: 6.90, description: "", image_url: "" },
    { name: "Banana Muffin", category: "muffin", price: 6.90, description: "", image_url: "" },
]

const INGREDIENTS = [
    // Bases
    { name: 'Lettuce', category: 'salad_base', price: 0.00 },
    { name: 'Spinach', category: 'salad_base', price: 0.00 },
    // Proteins
    { name: 'Chicken Breast', category: 'salad_protein', price: 3.50 },
    { name: 'Popcorn Chicken', category: 'salad_protein', price: 3.50 },
    { name: 'Smoked Duck', category: 'salad_protein', price: 3.50 },
    { name: 'Falafel', category: 'salad_protein', price: 3.50 },
    { name: 'Teriyaki Chicken', category: 'salad_protein', price: 3.50 },
    { name: 'Tuna Mayo', category: 'salad_protein', price: 3.50 },
    { name: 'Tofu', category: 'salad_protein', price: 2.50 },
    { name: 'Feta Cheese', category: 'salad_protein', price: 3.50 },
    { name: 'Avocado', category: 'salad_protein', price: 3.50 },
    { name: 'Chunky Tuna', category: 'salad_protein', price: 3.50 },
    { name: 'Cajun Chicken Breast', category: 'salad_protein', price: 4.00 },
    { name: 'Smoked Salmon', category: 'salad_protein', price: 4.50 },
    // Toppings
    { name: 'Raw Onions', category: 'salad_topping', price: 1.50 },
    { name: 'Raisins', category: 'salad_topping', price: 1.50 },
    { name: 'Potato Wedges', category: 'salad_topping', price: 1.50 },
    { name: 'Potato Salad', category: 'salad_topping', price: 1.50 },
    { name: 'Onsen Egg', category: 'salad_topping', price: 1.50 },
    { name: 'Herbed Pumpkin', category: 'salad_topping', price: 1.50 },
    { name: 'Hard-boiled Egg', category: 'salad_topping', price: 1.50 },
    { name: 'Egg Mayo', category: 'salad_topping', price: 1.50 },
    { name: 'Edamame', category: 'salad_topping', price: 1.50 },
    { name: 'Cucumber', category: 'salad_topping', price: 1.50 },
    { name: 'Croutons', category: 'salad_topping', price: 1.50 },
    { name: 'Corn', category: 'salad_topping', price: 1.50 },
    { name: 'Cherry Tomato', category: 'salad_topping', price: 1.50 },
    { name: 'Beetroot', category: 'salad_topping', price: 1.50 },
    { name: 'Baby Radish', category: 'salad_topping', price: 1.50 },
    { name: 'Pasta', category: 'salad_topping', price: 1.50 },
    { name: 'Broccoli', category: 'salad_topping', price: 1.50 },
    { name: 'Chickpeas', category: 'salad_topping', price: 1.50 },
    { name: 'Carrot', category: 'salad_topping', price: 1.50 },
    { name: 'Coleslaw', category: 'salad_topping', price: 1.50 },
    { name: 'Chia Seeds', category: 'salad_topping', price: 1.50 },
    { name: 'Pumpkin Seeds', category: 'salad_topping', price: 1.50 },
    { name: 'Sunflower Seeds', category: 'salad_topping', price: 1.50 },
    // Dressings
    { name: 'Roasted Sesame', category: 'salad_dressing', price: 0.00 },
    { name: 'Honey Mustard', category: 'salad_dressing', price: 0.00 },
    { name: 'Miso Ginger', category: 'salad_dressing', price: 0.00 },
    { name: 'Pomegranate Vinaigrette', category: 'salad_dressing', price: 0.00 },
    { name: 'Olive Oil', category: 'salad_dressing', price: 0.00 },
    { name: 'Balsamic Vinaigrette', category: 'salad_dressing', price: 0.00 },
    { name: 'Goma Dressing (Sesame)', category: 'salad_dressing', price: 0.00 },
    { name: 'Kimchi Mayo', category: 'salad_dressing', price: 0.00 },
    { name: 'Caesar Dressing', category: 'salad_dressing', price: 0.00 },
    { name: 'Thousand Island', category: 'salad_dressing', price: 0.00 },
    { name: 'Rosemary Olive Oil', category: 'salad_dressing', price: 0.00 },
    { name: 'Thyme Olive Oil', category: 'salad_dressing', price: 0.00 },
    { name: 'Sriracha Honey', category: 'salad_dressing', price: 0.00 },
    { name: 'Mayo', category: 'salad_dressing', price: 0.00 },
    { name: 'Wasabi Mayo', category: 'salad_dressing', price: 0.00 },
    { name: 'Curry Mayo', category: 'salad_dressing', price: 0.00 },
]

async function main() {
    // Login as admin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'davebazzzs@gmail.com',
        password: '@12345'
    })

    if (authError) {
        console.error("Login failed:", authError.message)
        return
    }
    console.log("Logged in successfully.")

    console.log("Deleting existing menu items...")
    const { error: deleteError } = await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000') // delete all
    if (deleteError) {
        console.error("Delete failed:", deleteError.message)
        return
    }

    console.log("Inserting new menu items...")
    const { error: insertMenuError } = await supabase.from('menu_items').insert(MENU_ITEMS)
    if (insertMenuError) {
        console.error("Insert menu failed:", insertMenuError.message)
    } else {
        console.log(`Inserted ${MENU_ITEMS.length} menu items.`)
    }

    console.log("Inserting ingredients...")
    const { error: insertIngrError } = await supabase.from('menu_items').insert(INGREDIENTS)
    if (insertIngrError) {
        console.error("Insert ingredients failed:", insertIngrError.message)
    } else {
        console.log(`Inserted ${INGREDIENTS.length} ingredients.`)
    }

    console.log("Migration complete.")
}

main()
