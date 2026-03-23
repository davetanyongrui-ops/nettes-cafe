'use client'

import { useState, useMemo } from 'react'
import { X, CheckCircle2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'

export type BYOIngredient = {
    id: string
    name: string
    price: number
    category: string
    is_sold_out: boolean
}

type Props = {
    open: boolean
    onClose: () => void
    ingredients: BYOIngredient[]
}

const MAX_TOPPINGS = 6

export default function BuildYourOwnModal({ open, onClose, ingredients }: Props) {
    const addItem = useCartStore(s => s.addItem)

    const bases = ingredients.filter(i => i.category === 'salad_base')
    const proteins = ingredients.filter(i => i.category === 'salad_protein')
    const dressings = ingredients.filter(i => i.category === 'salad_dressing')
    const toppings = ingredients.filter(i => i.category === 'salad_topping')

    const [base, setBase] = useState<BYOIngredient | null>(null)
    const [protein, setProtein] = useState<BYOIngredient | null>(null)
    const [dressing, setDressing] = useState<BYOIngredient | null>(null)
    const [selectedToppings, setSelectedToppings] = useState<BYOIngredient[]>([])
    const [added, setAdded] = useState(false)

    const toggleTopping = (t: BYOIngredient) => {
        if (selectedToppings.find(s => s.id === t.id)) {
            setSelectedToppings(prev => prev.filter(s => s.id !== t.id))
        } else if (selectedToppings.length < MAX_TOPPINGS) {
            setSelectedToppings(prev => [...prev, t])
        }
    }

    const total = useMemo(() => {
        return (
            (base?.price ?? 0) +
            (protein?.price ?? 0) +
            (dressing?.price ?? 0) +
            selectedToppings.reduce((s, t) => s + t.price, 0)
        )
    }, [base, protein, dressing, selectedToppings])

    const canAdd = !!base && !!protein && !!dressing

    const handleAdd = () => {
        if (!canAdd) return
        addItem({
            id: `byo-${Date.now()}`,
            name: `BYO: ${base!.name} & ${protein!.name}`,
            price: total,
            quantity: 1,
            category: 'salad_base',
            customizations: {
                base: { name: base!.name },
                proteins: [{ name: protein!.name }],
                dressings: [{ name: dressing!.name }],
                toppings: selectedToppings.map(t => ({ name: t.name })),
            },
        })
        setAdded(true)
        setTimeout(() => {
            setAdded(false)
            onClose()
            setBase(null); setProtein(null); setDressing(null); setSelectedToppings([])
        }, 1200)
    }

    if (!open) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-stone-100 shrink-0">
                        <div>
                            <h2 className="text-xl font-black text-stone-900">Build Your Own</h2>
                            <p className="text-sm text-stone-500 mt-0.5">Salad or Wrap — your way</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 transition text-stone-500">
                            <X size={22} />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="overflow-y-auto flex-1 p-6 space-y-8">

                        {/* Base */}
                        <Section title="1. Choose Your Base" required selected={!!base}>
                            <div className="grid grid-cols-2 gap-3">
                                {bases.map(b => (
                                    <ChoiceChip key={b.id} item={b} active={base?.id === b.id} onClick={() => setBase(b)} />
                                ))}
                            </div>
                        </Section>

                        {/* Protein */}
                        <Section title="2. Choose Your Protein" required selected={!!protein}>
                            <div className="grid grid-cols-2 gap-3">
                                {proteins.map(p => (
                                    <ChoiceChip key={p.id} item={p} active={protein?.id === p.id} onClick={() => setProtein(p)} />
                                ))}
                            </div>
                        </Section>

                        {/* Toppings */}
                        <Section title={`3. Choose Your Toppings (up to ${MAX_TOPPINGS})`} badge={`${selectedToppings.length}/${MAX_TOPPINGS}`}>
                            <div className="grid grid-cols-2 gap-3">
                                {toppings.map(t => {
                                    const isSelected = !!selectedToppings.find(s => s.id === t.id)
                                    const isDisabled = !isSelected && selectedToppings.length >= MAX_TOPPINGS
                                    return (
                                        <ChoiceChip
                                            key={t.id}
                                            item={t}
                                            active={isSelected}
                                            disabled={isDisabled}
                                            onClick={() => !isDisabled && toggleTopping(t)}
                                            checkIcon
                                        />
                                    )
                                })}
                            </div>
                        </Section>

                        {/* Dressing */}
                        <Section title="4. Choose Your Dressing" required selected={!!dressing}>
                            <div className="grid grid-cols-2 gap-3">
                                {dressings.map(d => (
                                    <ChoiceChip key={d.id} item={d} active={dressing?.id === d.id} onClick={() => setDressing(d)} />
                                ))}
                            </div>
                        </Section>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-stone-100 p-6 shrink-0 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Estimated Total</p>
                            <p className="text-2xl font-black text-emerald-900">${total.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={!canAdd}
                            className={`flex-1 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${added
                                ? 'bg-emerald-600 text-white'
                                : canAdd
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                }`}
                        >
                            {added ? (
                                <><CheckCircle2 size={20} /> Added to Order!</>
                            ) : (
                                <><Plus size={20} /> Add to Order {!canAdd && '(Select all required)'}</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

function Section({
    title, required, selected, badge, children,
}: {
    title: string; required?: boolean; selected?: boolean; badge?: string; children: React.ReactNode
}) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-stone-800">{title}</h3>
                {required && !selected && <span className="text-xs bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full border border-red-100">Required</span>}
                {required && selected && <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">✓ Done</span>}
                {badge && <span className="ml-auto text-xs bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full">{badge}</span>}
            </div>
            {children}
        </div>
    )
}

function ChoiceChip({
    item, active, disabled, onClick, checkIcon,
}: {
    item: BYOIngredient; active: boolean; disabled?: boolean; onClick: () => void; checkIcon?: boolean
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || item.is_sold_out}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold border transition-all text-left ${active
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : disabled || item.is_sold_out
                    ? 'bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
        >
            <span>{item.name}</span>
            <span className={`text-xs font-bold ${active ? 'text-emerald-100' : 'text-stone-400'}`}>
                {item.price > 0 ? `+$${item.price.toFixed(2)}` : 'Free'}
            </span>
        </button>
    )
}
