'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CustomPage, PageBlock, BlockType } from '@/types/builder'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Save, Trash2, ArrowLeft, Image as ImageIcon, Type, Minus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// --- Sortable Item Component ---
function SortableBlock({
    block,
    isActive,
    onClick,
    onDelete
}: {
    block: PageBlock,
    isActive: boolean,
    onClick: () => void,
    onDelete: () => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: block.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group bg-white border-2 rounded-2xl mb-4 overflow-hidden transition-all ${isActive ? 'border-emerald-500 shadow-lg scale-[1.02]' : 'border-stone-200 hover:border-emerald-300'}`}
        >
            <div className="flex">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="w-10 bg-stone-50 border-r border-stone-200 flex items-center justify-center cursor-grab active:cursor-grabbing text-stone-400 hover:bg-stone-100 transition"
                >
                    <GripVertical size={16} />
                </div>

                {/* Main Content Area */}
                <div
                    className="flex-1 p-6 cursor-pointer"
                    onClick={onClick}
                >
                    {block.type === 'text' && (
                        <div className={`
              ${block.style?.fontSize === '4xl' ? 'text-4xl font-black' : ''}
              ${block.style?.fontSize === '2xl' ? 'text-2xl font-bold' : ''}
              ${block.style?.fontSize === 'xl' ? 'text-xl font-semibold' : ''}
              ${block.style?.fontSize === 'base' || !block.style?.fontSize ? 'text-base font-medium' : ''}
              ${block.style?.textAlign === 'center' ? 'text-center' : block.style?.textAlign === 'right' ? 'text-right' : 'text-left'}
            `} style={{ color: block.style?.color || '#1c1917' }}>
                            {block.content || <span className="text-stone-300 italic">Empty text block</span>}
                        </div>
                    )}

                    {block.type === 'image' && (
                        <div className="w-full bg-stone-100 rounded-xl flex items-center justify-center overflow-hidden" style={{ minHeight: '200px' }}>
                            {block.content ? (
                                <img src={block.content} alt="Block image" className="w-full h-auto object-cover" />
                            ) : (
                                <div className="text-stone-400 flex flex-col items-center">
                                    <ImageIcon size={32} className="mb-2" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Image Placeholder</span>
                                </div>
                            )}
                        </div>
                    )}

                    {block.type === 'spacer' && (
                        <div className="w-full bg-emerald-50/50 border border-emerald-100 border-dashed rounded-lg flex items-center justify-center" style={{ height: block.style?.height || '100px' }}>
                            <span className="text-emerald-600/50 text-xs font-bold uppercase tracking-widest">{block.style?.height || '100px'} Spacer</span>
                        </div>
                    )}
                </div>

                {/* Delete Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="w-12 flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 transition"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}


export default function PageEditorClient({ pageId }: { pageId: string }) {
    const supabase = createClient()
    const router = useRouter()
    const [page, setPage] = useState<CustomPage | null>(null)
    const [blocks, setBlocks] = useState<PageBlock[]>([])
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    useEffect(() => {
        async function load() {
            const { data } = await supabase.from('custom_pages').select('*').eq('id', pageId).single()
            if (data) {
                setPage(data as CustomPage)
                setBlocks(data.blocks || [])
            }
        }
        load()
    }, [pageId])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id)
                const newIndex = items.findIndex(i => i.id === over?.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const addBlock = (type: BlockType) => {
        const newBlock: PageBlock = {
            id: crypto.randomUUID(),
            type,
            content: type === 'text' ? 'New Text Block' : '',
            style: { fontSize: 'base', color: '#1c1917', textAlign: 'left', height: '100px' }
        }
        setBlocks([...blocks, newBlock])
        setActiveBlockId(newBlock.id)
    }

    const updateActiveBlock = (updates: Partial<PageBlock>) => {
        setBlocks(blocks.map(b => b.id === activeBlockId ? { ...b, ...updates } : b))
    }

    const updateActiveBlockStyle = (styleUpdates: Partial<PageBlock['style']>) => {
        setBlocks(blocks.map(b => b.id === activeBlockId ? { ...b, style: { ...b.style, ...styleUpdates } } : b))
    }

    const savePage = async () => {
        setIsSaving(true)
        const { error } = await supabase.from('custom_pages').update({ blocks }).eq('id', pageId)
        setIsSaving(false)
        if (error) alert('Failed to save')
    }

    if (!page) return null

    const activeBlock = blocks.find(b => b.id === activeBlockId)

    return (
        <div className="flex h-[calc(100vh-6rem)] -m-8 lg:-m-12">
            {/* Editor Main Canvas */}
            <div className="flex-1 overflow-y-auto bg-stone-100 p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <Link href="/admin/pages" className="text-emerald-600 hover:text-emerald-800 flex items-center gap-2 font-bold">
                            <ArrowLeft size={18} /> Back to Pages
                        </Link>
                        <div className="text-right">
                            <h1 className="text-2xl font-black text-emerald-950">{page.title}</h1>
                            <p className="text-stone-500 font-mono text-sm">/{page.slug}</p>
                        </div>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
                            {blocks.map(block => (
                                <SortableBlock
                                    key={block.id}
                                    block={block}
                                    isActive={block.id === activeBlockId}
                                    onClick={() => setActiveBlockId(block.id)}
                                    onDelete={() => {
                                        setBlocks(blocks.filter(b => b.id !== block.id))
                                        if (activeBlockId === block.id) setActiveBlockId(null)
                                    }}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-6 py-3 bg-white text-stone-600 rounded-full shadow-sm border border-stone-200 hover:border-emerald-500 hover:text-emerald-600 font-bold transition">
                            <Type size={18} /> Add Text
                        </button>
                        <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-6 py-3 bg-white text-stone-600 rounded-full shadow-sm border border-stone-200 hover:border-emerald-500 hover:text-emerald-600 font-bold transition">
                            <ImageIcon size={18} /> Add Image
                        </button>
                        <button onClick={() => addBlock('spacer')} className="flex items-center gap-2 px-6 py-3 bg-white text-stone-600 rounded-full shadow-sm border border-stone-200 hover:border-emerald-500 hover:text-emerald-600 font-bold transition">
                            <Minus size={18} /> Add Spacer
                        </button>
                    </div>
                </div>
            </div>

            {/* Editor Sidebar */}
            <div className="w-96 bg-white border-l border-stone-200 p-6 flex flex-col shadow-2xl z-10">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-stone-100">
                    <h2 className="text-xl font-bold text-stone-900">Settings</h2>
                    <button
                        onClick={savePage}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save Page'}
                    </button>
                </div>

                {activeBlock ? (
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4 bg-emerald-50 py-1 px-3 rounded inline-block">
                                Edit {activeBlock.type}
                            </p>
                        </div>

                        {/* Common Inputs */}
                        {activeBlock.type !== 'spacer' && (
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Content</label>
                                {activeBlock.type === 'text' ? (
                                    <textarea
                                        value={activeBlock.content}
                                        onChange={e => updateActiveBlock({ content: e.target.value })}
                                        className="w-full h-32 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={activeBlock.content}
                                        placeholder="https://image-url.com/img.jpg"
                                        onChange={e => updateActiveBlock({ content: e.target.value })}
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                )}
                            </div>
                        )}

                        {/* Text Specific Styles */}
                        {activeBlock.type === 'text' && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">Text Size</label>
                                    <select
                                        value={activeBlock.style?.fontSize || 'base'}
                                        onChange={e => updateActiveBlockStyle({ fontSize: e.target.value })}
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
                                    >
                                        <option value="base">Normal (Paragraph)</option>
                                        <option value="xl">Large (Subtitle)</option>
                                        <option value="2xl">Extra Large (Heading)</option>
                                        <option value="4xl">Huge (Hero Text)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">Alignment</label>
                                    <select
                                        value={activeBlock.style?.textAlign || 'left'}
                                        onChange={e => updateActiveBlockStyle({ textAlign: e.target.value as any })}
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl"
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">Text Color</label>
                                    <input
                                        type="color"
                                        value={activeBlock.style?.color || '#1c1917'}
                                        onChange={e => updateActiveBlockStyle({ color: e.target.value })}
                                        className="w-full h-12 p-1 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer"
                                    />
                                </div>
                            </>
                        )}

                        {/* Spacer Specific */}
                        {activeBlock.type === 'spacer' && (
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Height (e.g. 50px, 4rem)</label>
                                <input
                                    type="text"
                                    value={activeBlock.style?.height || '100px'}
                                    onChange={e => updateActiveBlockStyle({ height: e.target.value })}
                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
                        <p className="text-stone-500 font-medium">Select a block to edit its settings</p>
                    </div>
                )}
            </div>
        </div>
    )
}
