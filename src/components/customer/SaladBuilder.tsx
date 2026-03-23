'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { Check } from 'lucide-react';

export type Ingredient = { id: string; name: string; price: number; is_sold_out: boolean; category: string };

interface SaladState {
    base: Ingredient | null;
    proteins: Ingredient[];
    dressings: Ingredient[];
    toppings: Ingredient[];
}

export default function SaladBuilder({ availableIngredients }: { availableIngredients: Ingredient[] }) {
    const addItem = useCartStore((state) => state.addItem);

    const [salad, setSalad] = useState<SaladState>({
        base: null,
        proteins: [],
        dressings: [],
        toppings: [],
    });

    const LIMITS = { proteins: 2, dressings: 1, toppings: 4 };

    const selectBase = (base: Ingredient) => {
        if (base.is_sold_out) return;
        setSalad((prev) => ({ ...prev, base }));
    };

    const toggleMultipleSelection = (
        category: 'proteins' | 'dressings' | 'toppings',
        item: Ingredient
    ) => {
        if (item.is_sold_out) return;

        const maxLimit = LIMITS[category];

        setSalad((prev) => {
            const currentSelection = prev[category];
            const isSelected = currentSelection.some((i) => i.id === item.id);

            if (isSelected) {
                return {
                    ...prev,
                    [category]: currentSelection.filter((i) => i.id !== item.id),
                };
            } else {
                if (currentSelection.length < maxLimit) {
                    return {
                        ...prev,
                        [category]: [...currentSelection, item],
                    };
                } else {
                    return prev;
                }
            }
        });
    };

    const calculateTotal = () => {
        let total = salad.base?.price || 0;
        salad.proteins.forEach(p => total += p.price);
        salad.dressings.forEach(d => total += d.price);
        salad.toppings.forEach(t => total += t.price);
        return total;
    };

    const handleAddToCart = () => {
        if (!salad.base) return;

        addItem({
            id: crypto.randomUUID(), // Each salad build is unique
            name: 'Custom Salad',
            price: calculateTotal(),
            quantity: 1,
            category: 'salad_custom',
            customizations: {
                base: salad.base,
                proteins: salad.proteins,
                dressings: salad.dressings,
                toppings: salad.toppings
            }
        });

        // Reset to start new salad
        setSalad({ base: null, proteins: [], dressings: [], toppings: [] });
        alert('Salad added to cart!');
    };

    const renderIngredientGrid = (
        title: string,
        category: 'base' | 'proteins' | 'dressings' | 'toppings',
        limit: number,
        type: 'salad_base' | 'salad_protein' | 'salad_dressing' | 'salad_topping'
    ) => {
        const items = availableIngredients.filter(i => i.category === type);
        const selectedItems = category === 'base' ? (salad.base ? [salad.base] : []) : salad[category];
        const isMaxedOut = selectedItems.length >= limit;

        return (
            <section className="mb-12">
                <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-2">
                    <h3 className="text-2xl font-bold text-stone-900">{title}</h3>
                    <span className="text-sm text-stone-500 font-bold uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full">
                        Choose up to {limit}
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map(item => {
                        const isSelected = selectedItems.some(i => i.id === item.id);
                        const isDisabled = item.is_sold_out || (!isSelected && isMaxedOut && category !== 'base');

                        return (
                            <button
                                key={item.id}
                                onClick={() => category === 'base' ? selectBase(item) : toggleMultipleSelection(category, item)}
                                disabled={isDisabled}
                                className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${isSelected
                                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-900/5'
                                        : item.is_sold_out
                                            ? 'border-stone-100 bg-stone-50 opacity-60 cursor-not-allowed'
                                            : 'border-stone-200 hover:border-emerald-300 hover:shadow-md bg-white'
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                )}
                                <span className="font-bold text-stone-900 mb-1">{item.name}</span>
                                <span className="text-sm text-stone-500">
                                    {item.price > 0 ? `+$${item.price.toFixed(2)}` : 'Included'}
                                </span>
                                {item.is_sold_out && (
                                    <span className="absolute bottom-3 right-3 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">SOLD OUT</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </section>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-emerald-950 mb-4 tracking-tight">Craft Your Perfect Salad</h1>
                <p className="text-lg text-stone-500 max-w-2xl mx-auto">Select the freshest ingredients for a perfectly balanced meal.</p>
            </div>

            {renderIngredientGrid('1. Select Your Base', 'base', 1, 'salad_base')}
            {renderIngredientGrid('2. Add Proteins', 'proteins', LIMITS.proteins, 'salad_protein')}
            {renderIngredientGrid('3. Pick a Dressing', 'dressings', LIMITS.dressings, 'salad_dressing')}
            {renderIngredientGrid('4. Extra Toppings', 'toppings', LIMITS.toppings, 'salad_topping')}

            <div className="sticky bottom-6 mt-16 p-6 bg-emerald-950 text-white rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-4 border-emerald-900/50 backdrop-blur-md">
                <div className="flex-1 w-full md:w-auto">
                    <p className="text-emerald-300 text-sm font-bold uppercase tracking-wider mb-1">Your Selection</p>
                    <div className="flex flex-wrap items-center gap-2 font-medium text-lg">
                        <span>{salad.base?.name || 'Please select a base'}</span>
                        {salad.proteins.length > 0 && <span className="text-emerald-400">&bull; {salad.proteins.length} Proteins</span>}
                        {salad.dressings.length > 0 && <span className="text-emerald-400">&bull; 1 Dressing</span>}
                        {salad.toppings.length > 0 && <span className="text-emerald-400">&bull; {salad.toppings.length} Toppings</span>}
                    </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto shrink-0">
                    <div className="text-right">
                        <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">Total</p>
                        <p className="font-black text-3xl tabular-nums leading-none">${calculateTotal().toFixed(2)}</p>
                    </div>
                    <button
                        className="bg-white text-emerald-950 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-lg"
                        disabled={!salad.base}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
