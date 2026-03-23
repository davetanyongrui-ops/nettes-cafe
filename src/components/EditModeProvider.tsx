'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, X } from 'lucide-react'

type EditModeCtx = { editMode: boolean; isAdmin: boolean }

const EditModeContext = createContext<EditModeCtx>({ editMode: false, isAdmin: false })

export const useEditMode = () => useContext(EditModeContext)

export function EditModeProvider({ children }: { children: React.ReactNode }) {
    const [editMode, setEditMode] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const checkAdmin = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role === 'admin' || profile?.role === 'staff') {
                setIsAdmin(true)
            }
        }
        checkAdmin()
    }, [])

    return (
        <EditModeContext.Provider value={{ editMode, isAdmin }}>
            {children}

            {/* Floating admin edit mode toolbar */}
            {isAdmin && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2">
                    <button
                        onClick={() => setEditMode(v => !v)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-2xl transition-all ${editMode
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-white text-stone-800 border border-stone-200 hover:bg-indigo-50 hover:text-indigo-700'
                            }`}
                    >
                        {editMode ? <X size={15} /> : <Pencil size={15} />}
                        {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
                    </button>
                </div>
            )}
        </EditModeContext.Provider>
    )
}
