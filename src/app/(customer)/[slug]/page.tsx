'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Render } from '@puckeditor/core'
import '@puckeditor/core/dist/index.css'
import { puckConfig } from '@/lib/puck/config'
import { CustomPage, PageBlock } from '@/types/builder'
import { Loader2 } from 'lucide-react'

// ─── Legacy block renderer (backwards compatible) ───────────────────────────
function BlockRenderer({ block }: { block: PageBlock }) {
    if (block.type === 'text') {
        const cls = [
            block.style?.fontSize === '4xl' ? 'text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight' : '',
            block.style?.fontSize === '2xl' ? 'text-2xl md:text-3xl font-bold mb-4' : '',
            block.style?.fontSize === 'xl' ? 'text-xl font-semibold mb-3' : '',
            !block.style?.fontSize || block.style?.fontSize === 'base' ? 'text-base font-medium mb-4 leading-relaxed' : '',
            block.style?.textAlign === 'center' ? 'text-center' : block.style?.textAlign === 'right' ? 'text-right' : 'text-left',
        ].filter(Boolean).join(' ')
        return (
            <div className={cls} style={{ color: block.style?.color || '#1c1917' }}>
                {block.content.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
            </div>
        )
    }
    if (block.type === 'image' && block.content) {
        return (
            <div className="w-full my-8 overflow-hidden rounded-3xl shadow-xl shadow-stone-200/50">
                <img src={block.content} alt="Page Image" className="w-full h-auto object-cover" />
            </div>
        )
    }
    if (block.type === 'spacer') {
        return <div style={{ height: block.style?.height || '80px' }} aria-hidden="true" />
    }
    return null
}

// ─── Main Dynamic Custom Page ─────────────────────────────────────────────────
export default function DynamicCustomPage({ params }: { params: any }) {
    const [page, setPage] = useState<(CustomPage & { content_json?: any }) | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFoundState, setNotFoundState] = useState(false)

    useEffect(() => {
        async function loadPage() {
            const resolvedParams = await params
            const pageSlug = resolvedParams.slug

            const supabase = createClient()
            const { data, error } = await supabase
                .from('custom_pages')
                .select('*')
                .eq('slug', pageSlug)
                .single()

            if (!data || error) setNotFoundState(true)
            else setPage(data as any)
            setLoading(false)
        }
        loadPage()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-[#7D8E74] mx-auto mb-4" size={40} />
                    <p className="text-[#2D2D2D]/60 font-medium">Loading page…</p>
                </div>
            </div>
        )
    }

    if (notFoundState || !page) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-black text-stone-200 mb-4">404</h1>
                    <p className="text-[#2D2D2D]/60 font-medium">This page does not exist.</p>
                </div>
            </div>
        )
    }

    // ── 1. Puck-built page (content_json exists and has blocks) ──────────────
    if (page.content_json?.content?.length > 0) {
        return (
            <div className="min-h-screen bg-[#F9F7F2]">
                <Render config={puckConfig} data={page.content_json} />
            </div>
        )
    }

    // ── 2. Legacy block-based fallback ────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F9F7F2] py-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-lg shadow-stone-200/50 border border-stone-100">
                    {page.blocks?.map(block => (
                        <BlockRenderer key={block.id} block={block} />
                    ))}
                    {(!page.blocks || page.blocks.length === 0) && (
                        <p className="text-stone-400 text-center italic py-20">This page is currently empty.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
