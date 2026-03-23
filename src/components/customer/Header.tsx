'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, Leaf, CalendarCheck } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import EditableText from '@/components/EditableText'
import { useEditMode } from '@/components/EditModeProvider'

type HeaderData = {
    logoText: string;
    navHome: string;
    navAbout: string;
    navMenu: string;
    navContact: string;
    bookBtn: string;
}

type CustomPageLink = { id: string; title: string; slug: string }

export default function Header({
    onCartOpen,
    customPages = [],
    headerData
}: {
    onCartOpen: () => void,
    customPages?: CustomPageLink[],
    headerData: HeaderData
}) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const totalItems = useCartStore(s => s.totalItems())
    const [mounted, setMounted] = useState(false)
    const { editMode } = useEditMode()
    const isEditable = editMode

    const NAV = [
        { href: '/', label: headerData.navHome, key: 'header_nav_home' },
        { href: '/about', label: headerData.navAbout, key: 'header_nav_about' },
        { href: '/menu', label: headerData.navMenu, key: 'header_nav_menu' },
        { href: '/contact', label: headerData.navContact, key: 'header_nav_contact' },
    ]

    useEffect(() => setMounted(true), [])
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-[#F9F7F2]/80 backdrop-blur-xl shadow-sm shadow-black/5 border-b border-[#7D8E74]/20'
                : 'bg-[#F9F7F2]/60 backdrop-blur-lg border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0 group">
                    <span className="w-8 h-8 rounded-full bg-[#7D8E74] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Leaf size={15} className="text-white" />
                    </span>
                    <span className="font-serif text-xl font-bold text-[#2D2D2D] tracking-tight leading-none group-hover:scale-[1.02] transition-transform">
                        <EditableText settingKey="header_logo" initialValue={headerData.logoText} isEditable={isEditable} />
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV.map(({ href, label, key }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${pathname === href
                                ? 'bg-[#7D8E74]/15 text-[#5a6b52] font-semibold'
                                : 'text-[#2D2D2D]/70 hover:text-[#7D8E74] hover:bg-[#7D8E74]/10'
                                }`}
                        >
                            <EditableText settingKey={key} initialValue={label} isEditable={isEditable} />
                        </Link>
                    ))}
                    {customPages.map(page => (
                        <Link
                            key={page.id}
                            href={`/${page.slug}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${pathname === `/${page.slug}`
                                ? 'bg-[#7D8E74]/15 text-[#5a6b52] font-semibold'
                                : 'text-[#2D2D2D]/70 hover:text-[#7D8E74] hover:bg-[#7D8E74]/10'
                                }`}
                        >
                            {page.title}
                        </Link>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    {/* Book a Table — desktop */}
                    <Link
                        href="/contact"
                        className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7D8E74] text-white text-sm font-semibold hover:bg-[#5a6b52] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                        <CalendarCheck size={15} />
                        <EditableText settingKey="header_book_btn" initialValue={headerData.bookBtn} isEditable={isEditable} />
                    </Link>

                    {/* Cart */}
                    <button
                        onClick={onCartOpen}
                        className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#2D2D2D]/5 text-[#2D2D2D] font-semibold text-sm hover:bg-[#2D2D2D]/10 transition-all border border-[#2D2D2D]/8"
                        aria-label="Open cart"
                    >
                        <ShoppingBag size={17} />
                        <span className="hidden sm:inline">Cart</span>
                        {mounted && totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#7D8E74] text-white text-xs font-black rounded-full flex items-center justify-center shadow">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(v => !v)}
                        className="md:hidden p-2 rounded-full text-[#2D2D2D]/70 hover:bg-[#7D8E74]/10 transition"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden bg-[#F9F7F2]/95 backdrop-blur-xl border-t border-[#7D8E74]/15 px-4 pb-5 pt-3 space-y-1">
                    {NAV.map(({ href, label, key }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-3 rounded-2xl font-medium text-sm transition min-h-[44px] flex items-center ${pathname === href
                                ? 'bg-[#718355]/15 text-[#5a6b44] font-semibold'
                                : 'text-[#2D2D2D]/70 hover:bg-[#718355]/10'
                                }`}
                        >
                            <EditableText settingKey={key} initialValue={label} isEditable={isEditable} />
                        </Link>
                    ))}
                    {customPages.map(page => (
                        <Link
                            key={page.id}
                            href={`/${page.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-3 rounded-2xl font-medium text-sm transition min-h-[44px] flex items-center ${pathname === `/${page.slug}`
                                ? 'bg-[#718355]/15 text-[#5a6b44] font-semibold'
                                : 'text-[#2D2D2D]/70 hover:bg-[#718355]/10'
                                }`}
                        >
                            {page.title}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 mt-2 px-4 py-3 rounded-2xl bg-[#718355] text-white font-semibold text-sm min-h-[44px]"
                    >
                        <CalendarCheck size={16} />
                        <EditableText settingKey="header_book_btn" initialValue={headerData.bookBtn} isEditable={isEditable} />
                    </Link>
                </div>
            )}
        </header>
    )
}
