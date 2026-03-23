'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CustomPage } from '@/types/builder'
import { Plus, Settings, Trash2, Globe, X, Loader2, FileText, BookOpen, Star, Megaphone, ChefHat } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const TEMPLATES = [
    {
        id: 'blank',
        name: 'Blank Page',
        description: 'Start with an empty canvas',
        icon: FileText,
        color: 'bg-stone-100 text-stone-600',
        blocks: []
    },
    {
        id: 'article',
        name: 'Article / Story',
        description: 'A heading, intro text and body paragraphs',
        icon: BookOpen,
        color: 'bg-blue-100 text-blue-600',
        blocks: [
            { id: crypto.randomUUID(), type: 'text', content: 'Page Title', style: { fontSize: '4xl', color: '#1c1917', textAlign: 'center' } },
            { id: crypto.randomUUID(), type: 'spacer', content: '', style: { height: '24px' } },
            { id: crypto.randomUUID(), type: 'text', content: 'Write an engaging introductory paragraph here. This sets the scene for your readers.', style: { fontSize: 'xl', color: '#57534e', textAlign: 'center' } },
            { id: crypto.randomUUID(), type: 'spacer', content: '', style: { height: '32px' } },
            { id: crypto.randomUUID(), type: 'text', content: 'Add your main body content here. You can write about your topic in detail, share your story, or provide useful information for visitors.', style: { fontSize: 'base', color: '#1c1917', textAlign: 'left' } },
        ]
    },
    {
        id: 'promo',
        name: 'Promotion / Offer',
        description: 'A bold headline with an offer description',
        icon: Megaphone,
        color: 'bg-amber-100 text-amber-600',
        blocks: [
            { id: crypto.randomUUID(), type: 'text', content: '🎉 Special Offer', style: { fontSize: '4xl', color: '#1c1917', textAlign: 'center' } },
            { id: crypto.randomUUID(), type: 'spacer', content: '', style: { height: '16px' } },
            { id: crypto.randomUUID(), type: 'text', content: 'Describe your amazing promotion here. Tell customers what they can get, when the offer is valid, and how to claim it.', style: { fontSize: 'xl', color: '#44403c', textAlign: 'center' } },
            { id: crypto.randomUUID(), type: 'spacer', content: '', style: { height: '24px' } },
            { id: crypto.randomUUID(), type: 'text', content: '📞 Call us on +62 21 000 0000 to book now!', style: { fontSize: 'base', color: '#059669', textAlign: 'center' } },
        ]
    },
    {
        id: 'menu_feature',
        name: 'Menu Feature',
        description: 'Spotlight a dish with an image',
        icon: ChefHat,
        color: 'bg-emerald-100 text-emerald-600',
        blocks: [
            { id: crypto.randomUUID(), type: 'text', content: 'Featured Dish', style: { fontSize: '4xl', color: '#064e3b', textAlign: 'center' } },
            { id: crypto.randomUUID(), type: 'spacer', content: '', style: { height: '16px' } },
            { id: crypto.randomUUID(), type: 'image', content: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', style: {} },
            { id: crypto.randomUUID(), type: 'text', content: 'Describe the dish in detail. Share the ingredients, the story behind it, and why customers will love it.', style: { fontSize: 'base', color: '#1c1917', textAlign: 'center' } },
        ]
    },
    {
        id: 'testimonial',
        name: 'Testimonials',
        description: 'Show reviews from happy customers',
        icon: Star,
        color: 'bg-yellow-100 text-yellow-600',
        blocks: [
            { id: crypto.randomUUID(), type: 'text', content: 'What Our Customers Say', style: { fontSize: '2xl', color: '#1c1917', textAlign: 'center' } },
            { id: crypto.randomUUID(), type: 'spacer', content: '', style: { height: '24px' } },
            { id: crypto.randomUUID(), type: 'text', content: '"The food here is absolutely amazing. I come back every week — it\'s the healthiest and tastiest meal I\'ve had!"\n— Sarah, Regular Customer', style: { fontSize: 'base', color: '#57534e', textAlign: 'center' } },
            { id: crypto.randomUUID(), type: 'spacer', content: '', style: { height: '16px' } },
            { id: crypto.randomUUID(), type: 'text', content: '"Perfect for hospital staff. Nutritious, quick, and delicious. Highly recommend."\n— Dr. Tan, Staff Member', style: { fontSize: 'base', color: '#57534e', textAlign: 'center' } },
        ]
    }
]

function NewPageModal({ onClose, onCreate }: { onClose: () => void, onCreate: (title: string, slug: string, blocks: any[]) => Promise<void> }) {
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('blank')
    const [saving, setSaving] = useState(false)

    const handleTitleChange = (val: string) => {
        setTitle(val)
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }

    const handleCreate = async () => {
        if (!title.trim() || !slug.trim()) return
        setSaving(true)
        const template = TEMPLATES.find(t => t.id === selectedTemplate)
        const blocks = template?.blocks.map(b => ({ ...b, id: crypto.randomUUID() })) || []
        await onCreate(title, slug, blocks)
        setSaving(false)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-stone-900">Create New Page</h2>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 transition text-stone-500">
                            <X size={22} />
                        </button>
                    </div>

                    {/* Page Details */}
                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Page Title *</label>
                            <input
                                type="text"
                                placeholder="e.g. Our Story, Special Offers"
                                value={title}
                                onChange={e => handleTitleChange(e.target.value)}
                                className="w-full p-4 text-lg bg-stone-50 border-2 border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">URL Slug</label>
                            <div className="flex items-center gap-2 p-4 bg-stone-50 border-2 border-stone-200 rounded-2xl">
                                <span className="text-stone-400 font-mono text-sm">yourdomain.com/</span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className="flex-1 bg-transparent font-mono text-sm text-emerald-700 font-bold outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Template Picker */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-stone-700 mb-4">Choose a Template</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {TEMPLATES.map(t => {
                                const Icon = t.icon
                                const isSelected = selectedTemplate === t.id
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t.id)}
                                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-emerald-300 bg-white'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-stone-900 text-sm">{t.name}</p>
                                            <p className="text-stone-500 text-xs mt-0.5">{t.description}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={!title.trim() || !slug.trim() || saving}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        {saving ? 'Creating...' : 'Create Page'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function PagesList() {
    const supabase = createClient()
    const router = useRouter()
    const [pages, setPages] = useState<CustomPage[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    const fetchPages = async () => {
        setLoading(true)
        const { data } = await supabase.from('custom_pages').select('*').order('created_at', { ascending: false })
        if (data) setPages(data as CustomPage[])
        setLoading(false)
    }

    useEffect(() => { fetchPages() }, [])

    const createPage = async (title: string, slug: string, blocks: any[]) => {
        const { data, error } = await supabase.from('custom_pages').insert({ title, slug, blocks }).select().single()
        if (error) {
            alert(`Failed to create page: ${error.message}`)
        } else if (data) {
            setShowModal(false)
            router.push(`/admin/pages/${data.id}`)
        }
    }

    const deletePage = async (id: string) => {
        const { error } = await supabase.from('custom_pages').delete().eq('id', id)
        if (error) {
            alert(`Error deleting page: ${error.message}`)
        } else {
            setConfirmDeleteId(null)
            fetchPages()
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            {showModal && <NewPageModal onClose={() => setShowModal(false)} onCreate={createPage} />}

            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-black text-emerald-950 mb-2 tracking-tight">Custom Pages</h1>
                    <p className="text-stone-500">Build and manage dynamic pages for your website.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 whitespace-nowrap"
                >
                    <Plus size={18} /> Add New Page
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-600" size={36} />
                </div>
            ) : pages.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-16 text-center">
                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Globe className="text-stone-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">No custom pages yet</h3>
                    <p className="text-stone-500 mb-6">Click the button above to create your first dynamic page.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition"
                    >
                        <Plus size={18} /> Create First Page
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pages.map(page => (
                        <div key={page.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition">
                            {confirmDeleteId === page.id ? (
                                // Inline delete confirmation
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-red-600">Delete "{page.title}"?</p>
                                        <p className="text-stone-400 text-sm">This cannot be undone.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setConfirmDeleteId(null)}
                                            className="px-4 py-2 text-sm font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 rounded-xl transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => deletePage(page.id)}
                                            className="px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl transition flex items-center gap-2"
                                        >
                                            <Trash2 size={15} /> Yes, Delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Normal row
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-emerald-950">{page.title}</h3>
                                        <p className="text-stone-500 font-mono text-sm mt-1">/{page.slug}</p>
                                        <p className="text-stone-400 text-xs mt-1">{(page.blocks || []).length} block{(page.blocks || []).length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/${page.slug}`}
                                            target="_blank"
                                            className="p-3 bg-stone-100 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                                            title="View Live Page"
                                        >
                                            <Globe size={18} />
                                        </Link>
                                        <Link
                                            href={`/admin/pages/${page.id}`}
                                            className="p-3 bg-stone-100 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                                            title="Open Editor"
                                        >
                                            <Settings size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setConfirmDeleteId(page.id)}
                                            className="p-3 bg-stone-100 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                            title="Delete Page"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
