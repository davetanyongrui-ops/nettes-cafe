'use client'

import { Puck } from '@puckeditor/core'
import '@puckeditor/core/dist/index.css'
import { puckConfig } from '@/lib/puck/config'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { Loader2, ChevronLeft, Globe, Eye } from 'lucide-react'
import Link from 'next/link'

type Props = { pageId: string }

export default function PuckEditorClient({ pageId }: Props) {
    const supabase = createClient()
    const [initialData, setInitialData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [pageTitle, setPageTitle] = useState('Custom Page')
    const [pageSlug, setPageSlug] = useState('')
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

    useEffect(() => {
        async function loadPage() {
            const { data } = await supabase
                .from('custom_pages')
                .select('title, slug, content_json')
                .eq('id', pageId)
                .single()

            if (data) {
                setPageTitle(data.title)
                setPageSlug(data.slug)
                // Use content_json if it exists, otherwise empty canvas
                setInitialData(
                    data.content_json || { content: [], root: { props: {} } }
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
            .update({
                content_json: data,
                updated_at: new Date().toISOString()
            })
            .eq('id', pageId)

        setSaveStatus(error ? 'error' : 'saved')
        if (!error) setTimeout(() => setSaveStatus('idle'), 3000)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F9F7F2]">
                <div className="text-center">
                    <Loader2 className="animate-spin text-[#7D8E74] mx-auto mb-3" size={36} />
                    <p className="text-[#2D2D2D]/60 font-medium">Loading visual editor…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* ── Premium Header Bar ──────────────────────────────────────── */}
            <header className="flex items-center justify-between px-4 h-12 bg-[#2D2D2D] text-white shrink-0 shadow-xl z-50">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/pages"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-[#7D8E74] font-semibold text-sm"
                    >
                        <ChevronLeft size={15} />
                        All Pages
                    </Link>
                    <span className="text-white/20 text-lg">|</span>
                    <span className="font-semibold text-sm text-white/80 truncate max-w-[180px] hidden sm:block">
                        {pageTitle}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {saveStatus === 'saving' && (
                        <span className="flex items-center gap-1.5 text-[#7D8E74] text-sm">
                            <Loader2 size={13} className="animate-spin" /> Saving…
                        </span>
                    )}
                    {saveStatus === 'saved' && (
                        <span className="text-[#7D8E74] text-sm font-semibold">✓ Published!</span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-400 text-sm font-semibold">✗ Save Failed</span>
                    )}

                    {pageSlug && (
                        <Link
                            href={`/${pageSlug}`}
                            target="_blank"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition text-white/80 text-sm font-medium"
                        >
                            <Eye size={13} /> Preview
                        </Link>
                    )}
                </div>
            </header>

            {/* ── Puck Editor ─────────────────────────────────────────────── */}
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
