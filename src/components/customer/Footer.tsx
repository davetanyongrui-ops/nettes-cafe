'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Facebook, Leaf, ArrowUpRight } from 'lucide-react'
import EditableText from '@/components/EditableText'
import { useEditMode } from '@/components/EditModeProvider'

type FooterData = { cafeName: string; tagline: string; copyright: string; phone: string; email: string; address: string; igHandle: string; fbName: string; }
type HeaderData = { navHome: string; navAbout: string; navMenu: string; navContact: string; }

type FooterProps = {
    footerData: FooterData
    headerData: HeaderData
}

export default function Footer({
    footerData,
    headerData,
}: FooterProps) {
    const { editMode } = useEditMode()
    const isEditable = editMode
    const EXPLORE = [
        { href: '/', label: headerData.navHome, key: 'header_nav_home' },
        { href: '/about', label: headerData.navAbout, key: 'header_nav_about' },
        { href: '/menu', label: headerData.navMenu, key: 'header_nav_menu' },
        { href: '/contact', label: headerData.navContact, key: 'header_nav_contact' },
    ]
    return (
        <footer className="bg-[#2D2D2D] text-stone-200">
            {/* Main grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

                    {/* Brand column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <span className="w-8 h-8 rounded-full bg-[#7D8E74] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                                <Leaf size={14} className="text-white" />
                            </span>
                            <span className="font-serif text-xl font-bold text-white tracking-tight">
                                <EditableText settingKey="footer_cafe_name" initialValue={footerData.cafeName}
                                    className="font-serif text-xl font-bold text-white tracking-tight" isEditable={isEditable} />
                            </span>
                        </Link>
                        <p className="text-sm text-stone-500 leading-relaxed max-w-[220px]">
                            <EditableText settingKey="footer_tagline" initialValue={footerData.tagline}
                                className="text-sm text-stone-500 leading-relaxed"
                                wrapperClassName="w-full" as="textarea" isEditable={isEditable} />
                        </p>
                        {/* Decorative accent line */}
                        <div className="w-12 h-0.5 bg-[#718355] rounded-full mt-1" />
                    </div>

                    {/* Contact column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-stone-500">Contact</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="tel:+6580981919" className="flex items-start gap-3 text-sm text-stone-400 hover:text-white transition group w-fit">
                                    <Phone size={15} className="mt-0.5 text-[#718355] group-hover:text-[#a3b39b] transition shrink-0" />
                                    <span>
                                        <EditableText settingKey="footer_phone" initialValue={footerData.phone} isEditable={isEditable} />
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:hello@nettescafe.sg" className="flex items-start gap-3 text-sm text-stone-400 hover:text-white transition group w-fit">
                                    <Mail size={15} className="mt-0.5 text-[#718355] group-hover:text-[#a3b39b] transition shrink-0" />
                                    <span>
                                        <EditableText settingKey="footer_email" initialValue={footerData.email} isEditable={isEditable} />
                                    </span>
                                </a>
                            </li>
                            <li>
                                <span className="flex items-start gap-3 text-sm text-stone-400 w-fit">
                                    <MapPin size={15} className="mt-0.5 text-[#718355] shrink-0" />
                                    <span>
                                        <EditableText settingKey="footer_address" initialValue={footerData.address} as="textarea" isEditable={isEditable} />
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-stone-500">Hours</h3>
                        <ul className="space-y-2 text-sm text-stone-400">
                            <li className="flex justify-between w-full max-w-[200px]"><span>Mon - Wed</span> <span>9:00 AM – 5:00 PM</span></li>
                            <li className="flex justify-between w-full max-w-[200px]"><span>Thu - Sun</span> <span className="text-stone-500">Closed</span></li>
                        </ul>
                    </div>

                    {/* Explore column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-stone-500">Explore</h3>
                        <ul className="space-y-2.5">
                            {EXPLORE.map(({ href, label, key }) => (
                                <li key={href} className="w-fit">
                                    <Link
                                        href={href}
                                        className="text-sm text-stone-400 hover:text-white transition flex items-center gap-1 group w-fit"
                                    >
                                        <EditableText settingKey={key} initialValue={label} isEditable={isEditable} />
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition -translate-x-1 group-hover:translate-x-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Follow Us column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-stone-500">Follow Us</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-stone-400 hover:text-white transition group w-fit"
                                >
                                    <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#718355] transition">
                                        <Instagram size={14} />
                                    </span>
                                    <EditableText settingKey="footer_ig" initialValue={footerData.igHandle} isEditable={isEditable} />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-stone-400 hover:text-white transition group w-fit"
                                >
                                    <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#718355] transition">
                                        <Facebook size={14} />
                                    </span>
                                    <EditableText settingKey="footer_fb" initialValue={footerData.fbName} isEditable={isEditable} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-stone-800/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-stone-600">
                    <EditableText settingKey="footer_copyright" initialValue={footerData.copyright}
                        className="text-xs text-stone-600" isEditable={isEditable} />
                </p>
                <a
                    href="/admin/login"
                    className="text-[10px] text-stone-800 hover:text-stone-500 transition tracking-widest uppercase font-bold"
                >
                    Staff Access
                </a>
            </div>
        </footer>
    )
}
