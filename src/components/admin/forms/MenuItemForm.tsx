'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { menuItemSchema, MenuItemFormValues } from '@/lib/validations/menu'
import { createMenuItem, updateMenuItem } from '@/lib/actions/menuActions'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Upload, ImageIcon, X } from 'lucide-react'
import { useState, useRef } from 'react'

export default function MenuItemForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<MenuItemFormValues>({
        resolver: zodResolver(menuItemSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            category: 'soup',
            price: 0,
            is_sold_out: false,
            image_url: '',
        },
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show local preview immediately
        const localUrl = URL.createObjectURL(file)
        setImagePreview(localUrl)
        setIsUploading(true)

        try {
            const supabase = createClient()
            const ext = file.name.split('.').pop()
            const fileName = `menu-${Date.now()}.${ext}`

            const { error: uploadError } = await supabase.storage
                .from('menu-images')
                .upload(fileName, file, { upsert: true })

            if (uploadError) {
                throw new Error(uploadError.message)
            }

            const { data: { publicUrl } } = supabase.storage
                .from('menu-images')
                .getPublicUrl(fileName)

            setValue('image_url', publicUrl)
            setImagePreview(publicUrl)
        } catch (err: any) {
            console.error('Image upload failed:', err)
            setSubmitError('Image upload failed: ' + (err.message || 'Unknown error'))
            setImagePreview(initialData?.image_url || null)
        } finally {
            setIsUploading(false)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        setValue('image_url', '')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const onSubmit = async (data: MenuItemFormValues) => {
        setSubmitError(null)
        try {
            if (initialData?.id) {
                await updateMenuItem(initialData.id, data)
            } else {
                await createMenuItem(data)
            }
        } catch (error: any) {
            setSubmitError(error.message || 'An error occurred while saving the menu item.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm">
            {submitError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    {submitError}
                </div>
            )}

            {/* ── Image Upload ────────────────────────────────────────── */}
            <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Food Photo</label>
                <input type="hidden" {...register('image_url')} />
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                />

                {imagePreview ? (
                    <div className="relative group w-full max-w-xs">
                        <img
                            src={imagePreview}
                            alt="Food preview"
                            className="w-full h-48 object-cover rounded-2xl border border-stone-200 shadow-sm"
                        />
                        {isUploading && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Loader2 className="animate-spin text-emerald-600" size={32} />
                            </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-white/90 backdrop-blur rounded-xl shadow-md hover:bg-white transition text-stone-600"
                                title="Change image"
                            >
                                <Upload size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="p-2 bg-white/90 backdrop-blur rounded-xl shadow-md hover:bg-red-50 transition text-red-500"
                                title="Remove image"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-xs h-48 rounded-2xl border-2 border-dashed border-stone-200 hover:border-emerald-400 bg-stone-50 hover:bg-emerald-50/30 transition flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-emerald-600 cursor-pointer"
                    >
                        <ImageIcon size={32} />
                        <span className="text-sm font-semibold">Click to upload food photo</span>
                        <span className="text-xs text-stone-400">JPG, PNG, WebP · Max 5 MB</span>
                    </button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Item Name</label>
                    <input {...register('name')} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50 focus:bg-white transition" placeholder="e.g., Herbal Chicken Soup" />
                    {errors.name && <p className="text-red-500 text-sm mt-1 font-medium">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Price ($)</label>
                    <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50 focus:bg-white transition" />
                    {errors.price && <p className="text-red-500 text-sm mt-1 font-medium">{errors.price.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                    <select {...register('category')} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50 focus:bg-white transition appearance-none">
                        <option value="soup">Soup</option>
                        <option value="special">Daily Special</option>
                        <option value="pie">Pie</option>
                        <option value="pastry">Pastry</option>
                        <option value="muffin">Muffin</option>
                        <option value="wrap">Wrap</option>
                        <option value="salad_base">Salad Base</option>
                        <option value="salad_protein">Salad Protein</option>
                        <option value="salad_dressing">Salad Dressing</option>
                        <option value="salad_topping">Salad Topping</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1 font-medium">{errors.category.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                    <textarea {...register('description')} rows={3} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50 focus:bg-white transition resize-none" placeholder="Tell customers about this item..." />
                    {errors.description && <p className="text-red-500 text-sm mt-1 font-medium">{errors.description.message}</p>}
                </div>

                <div className="md:col-span-2 flex items-center p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <input type="checkbox" {...register('is_sold_out')} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mr-3 accent-emerald-600 cursor-pointer" id="soldOut" />
                    <label htmlFor="soldOut" className="text-sm font-bold text-stone-800 cursor-pointer select-none">Mark as Sold Out</label>
                </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-xl font-bold bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {initialData?.id ? 'Save Changes' : 'Create Item'}
                </button>
            </div>
        </form>
    )
}
