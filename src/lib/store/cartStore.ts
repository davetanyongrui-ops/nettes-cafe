import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
    category: string
    customizations?: any
}

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string, customizations: any) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find(
                        (i) =>
                            i.id === item.id &&
                            JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
                    )
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i === existingItem ? { ...i, quantity: i.quantity + item.quantity } : i
                            ),
                        }
                    }
                    return { items: [...state.items, item] }
                }),
            removeItem: (id, customizations) =>
                set((state) => ({
                    items: state.items.filter(
                        (i) => !(i.id === id && JSON.stringify(i.customizations) === JSON.stringify(customizations))
                    ),
                })),
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
        }),
        {
            name: 'nettes-cafe-cart',
        }
    )
)
