// Represents a single row from the site_settings table
export type SiteSetting = {
    key: string
    value: string
}

// Flat key→value map built from all rows
export type SettingsMap = Record<string, string>

// Converts the array of DB rows into a SettingsMap for easy access
export function toSettingsMap(rows: SiteSetting[]): SettingsMap {
    return Object.fromEntries((rows ?? []).map(({ key, value }) => [key, value]))
}

// Helper: get a value with a fallback if the key doesn't exist yet
export function getSetting(map: SettingsMap, key: string, fallback = ''): string {
    return map[key] ?? fallback
}

// Menu item as returned from the menu_items table
export type MenuItem = {
    id: string
    name: string
    description: string | null
    category: string
    price: number
    is_sold_out: boolean
    image_url: string | null
    metadata: { sizes?: { label: string; price: number }[]; dietary?: string[] } | null
    created_at: string
    updated_at: string
}

export type MenuCategory =
    | 'soup'
    | 'muffin'
    | 'pie'
    | 'wrap'
    | 'special'
    | 'pastry'
    | 'salad_base'
    | 'salad_protein'
    | 'salad_dressing'
    | 'salad_topping'
    | 'juice'
    | 'build_bowl'
    | 'build_wrap'
    | 'coffee'
    | 'tea'
    | 'milkshakes'
    | 'other_drinks'
    | 'daily_special'
