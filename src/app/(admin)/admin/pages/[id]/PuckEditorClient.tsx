'use client'

import { Puck } from '@puckeditor/core'
import '@puckeditor/core/dist/index.css'
import { puckConfig } from '@/lib/puck/config'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { Loader2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Props = { pageId: string }

export default function PuckEditorClient({ pageId }: Props) {
    const supabase = createClient()
    const [initialData, setInitialData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [pageTitle, setPageTitle] = useState('Custom Page')
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

    useEffect(() => {
        async function loadPage() {
            const { data, error } = await supabase
                .from('custom_pages')
                .select('title, puck_data')
                .eq('id', pageId)
                .single()

            if (data) {
                setPageTitle(data.title)
                // If puck_data already exists use it, otherwise start blank
                setInitialData(
                    data.puck_data || { content: [], root: { props: {} } }
                )
            } else {
                setInitialData({ content: [], root: { props: {} } })
            }
            setLoading(false)
        }
        loadPage()
    }, [pageId])

    const handlePublish = async (data: any) => {
        setSaveStatus('saving')
        const { error } = await supabase
            .from('custom_pages')
            .update({ puck_data: data, updated_at: new Date().toISOString() })
            .eq('id', pageId)

        if (error) {
            setSaveStatus('error')
            console.error('Failed to save page:', error)
        } else {
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus('idle'), 2500)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#f5f0e8]">
                <div className="text-center">
                    <Loader2 className="animate-spin text-[#2d4a3e] mx-auto mb-3" size={36} />
                    <p className="text-stone-500 font-medium">Loading visual editor…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Custom Premium Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d4a3e] text-white shrink-0 z-50 shadow-lg">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/pages"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-[#a3c99e] font-medium text-sm"
                    >
                        <ChevronLeft size={16} />
                        All Pages
                    </Link>
                    <span className="text-white/20">|</span>
                    <span className="font-semibold text-sm truncate max-w-[200px]">{pageTitle}</span>
                </div>

                <div className="flex items-center gap-3">
                    {saveStatus === 'saving' && (
                        <span className="flex items-center gap-1.5 text-[#a3c99e] text-sm">
                            <Loader2 size={14} className="animate-spin" /> Saving…
                        </span>
                    )}
                    {saveStatus === 'saved' && (
                        <span className="text-[#a3c99e] text-sm font-semibold">✓ Saved!</span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-300 text-sm font-semibold">✗ Save failed</span>
                    )}
                </div>
            </div>

            {/* Puck Editor — fills remaining height */}
            <div className="flex-1 overflow-hidden">
                <Puck
                    config={puckConfig}
                    data={initialData}
                    onPublish={handlePublish}
                    iframe={{ enabled: false }}
                />
            </div>
        </div>
    )
}
