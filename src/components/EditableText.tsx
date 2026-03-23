'use client'

import { useRef, useState, useCallback, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Pencil } from 'lucide-react'

type Props = {
    settingKey: string
    initialValue: string
    as?: 'input' | 'textarea'
    className?: string
    wrapperClassName?: string
    isEditable?: boolean
}

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
    return (
        <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-2 ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            {type === 'success' ? '✓' : '✗'} {msg}
        </div>
    )
}

export default function EditableText({
    settingKey,
    initialValue,
    as = 'input',
    className = '',
    wrapperClassName = '',
    isEditable = false,
}: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialValue)
    const [savedValue, setSavedValue] = useState(initialValue)
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
    const [isPending, startTransition] = useTransition()
    const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

    // ── NOT editable: pure static span, zero event listeners ──────────────────
    if (!isEditable) {
        return <span className={className}>{value}</span>
    }

    // ── EDITABLE ──────────────────────────────────────────────────────────────
    const save = async () => {
        if (value === savedValue) { setIsEditing(false); return }
        setIsEditing(false)
        startTransition(async () => {
            const supabase = createClient()
            const { error } = await supabase
                .from('site_settings')
                .upsert({ key: settingKey, value }, { onConflict: 'key' })
            if (error) {
                setValue(savedValue)
                setToast({ msg: `Save failed: ${error.message}`, type: 'error' })
            } else {
                setSavedValue(value)
                setToast({ msg: 'Saved!', type: 'success' })
            }
            setTimeout(() => setToast(null), 2500)
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && as === 'input') save()
        if (e.key === 'Escape') { setValue(savedValue); setIsEditing(false) }
    }

    const editableBase = 'outline-none ring-0 w-full transition-all rounded-md cursor-text'
    const editableHover = 'hover:bg-white/20 hover:outline hover:outline-2 hover:outline-dashed hover:outline-indigo-400'
    // When editing: solid white bg + forced dark text so it's readable on any background
    const editingState = 'bg-white text-stone-900 border-2 border-indigo-500 border-dashed px-2 shadow-lg'
    const sharedClasses = [editableBase, isEditing ? editingState : editableHover, isEditing ? '' : className].join(' ')

    return (
        <span className={`relative group inline-block ${wrapperClassName}`}>
            {!isEditing && (
                <span className="absolute -top-5 -right-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                    <span className="bg-indigo-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Pencil size={9} /> edit
                    </span>
                </span>
            )}
            {isPending && (
                <span className="absolute -top-5 -right-1 z-10">
                    <span className="bg-stone-800 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Loader2 size={9} className="animate-spin" /> saving
                    </span>
                </span>
            )}
            {as === 'textarea' ? (
                <textarea ref={inputRef} value={value} className={`${sharedClasses} resize-none`} rows={3}
                    onClick={() => setIsEditing(true)} onChange={e => setValue(e.target.value)}
                    onBlur={save} onKeyDown={handleKeyDown} readOnly={!isEditing} />
            ) : (
                <input ref={inputRef} type="text" value={value} className={sharedClasses}
                    onClick={() => setIsEditing(true)} onChange={e => setValue(e.target.value)}
                    onBlur={save} onKeyDown={handleKeyDown} readOnly={!isEditing} />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </span>
    )
}
