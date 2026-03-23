'use client'

import { useState, useTransition } from 'react'
import { updateSiteSetting } from '@/lib/actions/contentActions'
import { Loader2, Save, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

type FieldDef = {
    key: string
    label: string
    multiline?: boolean
    hint?: string
}

type Section = {
    title: string
    keys: FieldDef[]
}

export default function ContentManagerClient({
    sections,
    currentValues,
}: {
    sections: Section[]
    currentValues: Record<string, string>
}) {
    const [values, setValues] = useState<Record<string, string>>(currentValues)
    const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set())
    const [open, setOpen] = useState<string | null>(sections[0]?.title ?? null)
    const [isPending, startTransition] = useTransition()
    const [savingKey, setSavingKey] = useState<string | null>(null)

    const handleSave = (key: string) => {
        setSavingKey(key)
        startTransition(async () => {
            try {
                await updateSiteSetting(key, values[key] ?? '')
                setSavedKeys(prev => new Set([...prev, key]))
                setTimeout(() => setSavedKeys(prev => { const n = new Set(prev); n.delete(key); return n }), 2500)
            } catch {
                alert(`Failed to save "${key}". Please try again.`)
            } finally {
                setSavingKey(null)
            }
        })
    }

    return (
        <div className="max-w-3xl space-y-4">
            {sections.map(section => {
                const isOpen = open === section.title
                return (
                    <div key={section.title} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                        <button
                            onClick={() => setOpen(isOpen ? null : section.title)}
                            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-stone-50 transition"
                        >
                            <h2 className="font-black text-stone-900 text-lg">{section.title}</h2>
                            {isOpen ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
                        </button>

                        {isOpen && (
                            <div className="border-t border-stone-100 px-6 pb-6 pt-5 space-y-6">
                                {section.keys.map(field => {
                                    const isSaving = savingKey === field.key
                                    const isSaved = savedKeys.has(field.key)

                                    return (
                                        <div key={field.key}>
                                            <div className="flex justify-between items-baseline mb-1.5">
                                                <label className="text-sm font-bold text-stone-700">{field.label}</label>
                                                <span className="text-[11px] text-stone-400 font-mono">{field.key}</span>
                                            </div>
                                            {field.hint && (
                                                <p className="text-xs text-stone-400 mb-1.5">{field.hint}</p>
                                            )}
                                            {field.multiline ? (
                                                <textarea
                                                    rows={3}
                                                    value={values[field.key] ?? ''}
                                                    onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none text-sm text-stone-800"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={values[field.key] ?? ''}
                                                    onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm text-stone-800"
                                                />
                                            )}
                                            <div className="mt-2 flex justify-end">
                                                <button
                                                    onClick={() => handleSave(field.key)}
                                                    disabled={isSaving || isPending}
                                                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition ${isSaved
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm disabled:opacity-60'
                                                        }`}
                                                >
                                                    {isSaved ? (
                                                        <><CheckCircle2 size={15} /> Saved!</>
                                                    ) : isSaving ? (
                                                        <><Loader2 size={15} className="animate-spin" /> Saving…</>
                                                    ) : (
                                                        <><Save size={15} /> Save</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
