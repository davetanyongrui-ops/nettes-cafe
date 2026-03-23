'use client'

import { useEffect, useRef } from 'react'
import { MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SettingsMap, getSetting } from '@/types/database'
import EditableText from '@/components/EditableText'

// ─── Thin-line SVG icons in Terracotta ────────────────────────────────────────
function IconFlame() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M12 2C12 2 6 8 6 13a6 6 0 0012 0c0-2.5-1.5-5-3-7" />
            <path d="M12 22v-4" />
            <path d="M9 18c0 1.5 1.5 3 3 3s3-1.5 3-3" />
        </svg>
    )
}
function IconDroplet() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M12 2L5.5 9.5a9 9 0 1013 0L12 2z" />
        </svg>
    )
}
function IconLeaf() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M11 20A7 7 0 0118 13V3s-12 3-12 13a7 7 0 005 6.708" />
            <path d="M18 3L9 12" />
        </svg>
    )
}

// ─── Scroll-reveal hook ────────────────────────────────────────────────────────
function useFadeIn() {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('about-visible'); obs.unobserve(el) } },
            { threshold: 0.12 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return ref
}

// ─── Reusable fade wrapper ─────────────────────────────────────────────────────
function Fade({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useFadeIn()
    return (
        <div
            ref={ref}
            className={`about-fade ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}

type Props = {
    settings?: SettingsMap
    isEditable?: boolean
}

export default function AboutView({ settings = {}, isEditable = false }: Props) {
    const s = settings;

    return (
        <>
            <div className="bg-oatmeal overflow-hidden">

                {/* ══════════════════════════════════════════════════════
                         NEW FULL-WIDTH HERO SECTION
                    ══════════════════════════════════════════════════════ */}
                <section className="relative h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
                    {/* Background Image with Parallax & Darkening Overlay */}
                    <div className="absolute inset-0">
                        <img 
                            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2694&auto=format&fit=crop" 
                            alt="Cafe ambiance pouring coffee" 
                            className="w-full h-full object-cover object-center"
                            style={{ filter: 'brightness(0.65)' }}
                        />
                    </div>
                    {/* Subtle grain/noise overlay for texture */}
                    <div className="absolute inset-0 bg-oatmeal/5 mix-blend-overlay pointer-events-none" />

                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
                        <p 
                            className="text-oatmeal/80 font-bold uppercase tracking-[0.3em] text-[12px] mb-6 drop-shadow-md"
                            style={{ animation: 'fadeInUp 0.8s ease-out 100ms both' }}
                        >
                            <EditableText 
                                settingKey="about_hero_top_label" 
                                initialValue="Nette's Cafe" 
                                isEditable={isEditable} 
                            />
                        </p>
                        <h1 
                            className="playfair text-5xl md:text-7xl text-white mb-8 drop-shadow-xl leading-tight" 
                            style={{ animation: 'fadeInUp 0.8s ease-out 300ms both' }}
                        >
                            <EditableText 
                                settingKey="about_hero_main_title" 
                                initialValue="Nourishing the Community" 
                                className="playfair text-white drop-shadow-xl leading-tight"
                                isEditable={isEditable} 
                            />
                        </h1>
                        <div 
                            className="text-white/90 text-lg md:text-xl font-light max-w-2xl drop-shadow-md leading-relaxed" 
                            style={{ animation: 'fadeInUp 0.8s ease-out 500ms both' }}
                        >
                            <EditableText 
                                settingKey="about_hero_main_subtitle" 
                                initialValue="Discover the heart, soul, and slow-simmered dedication behind every bowl we serve to the hospital and beyond." 
                                as="textarea"
                                className="text-white/90 font-light leading-relaxed"
                                isEditable={isEditable} 
                            />
                        </div>
                    </div>
                    {/* Down indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-70 animate-bounce">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                         INTRO — Split-Screen Layout
                    ══════════════════════════════════════════════════════ */}
                <section className="py-24 md:py-32 flex flex-col lg:flex-row gap-12 lg:gap-0">
                    {/* Left: Fresh ingredients image */}
                    <div className="relative lg:w-1/2 h-[60vw] lg:h-auto min-h-[500px] overflow-hidden rounded-r-[3rem] shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1480&auto=format&fit=crop"
                            alt="Fresh ginger, turmeric, and herbs"
                            className="absolute inset-0 w-full h-full object-cover object-center scale-[1.03]"
                            style={{ filter: 'brightness(0.9) saturate(1.1)' }}
                        />
                        {/* Subtle warm gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#2D2D2D]/10 via-transparent to-oatmeal/20 pointer-events-none" />
                    </div>

                    {/* Right: Oatmeal background text panel */}
                    <div className="lg:w-1/2 bg-oatmeal flex items-center">
                        <div className="px-10 sm:px-16 lg:px-24 py-10 lg:py-0 max-w-xl w-full mx-auto lg:mx-0">
                            {/* Hero text wrapped in fade wrappers now since it's lower down the page */}
                            <Fade delay={100}>
                                <p className="text-terracotta font-bold uppercase tracking-[0.25em] text-[10px] mb-8">
                                    Our Roots
                                </p>
                            </Fade>
                            <Fade delay={200}>
                                <h1 className="playfair text-[2.8rem] sm:text-5xl lg:text-[3.6rem] text-charcoal leading-[1.1] tracking-tight mb-8">
                                    <EditableText
                                        settingKey="about_hero_title"
                                        initialValue={getSetting(s, 'about_hero_title', 'Nourishment for the Soul and Body.')}
                                        className="playfair text-charcoal tracking-tight"
                                        isEditable={isEditable}
                                    />
                                </h1>
                            </Fade>
                            <Fade delay={300}>
                                <div className="text-charcoal/60 text-[16px] leading-[1.85] mb-12 max-w-md">
                                    <EditableText
                                        settingKey="about_hero_subtitle"
                                        initialValue={getSetting(s, 'about_hero_subtitle', 'In the heart of Tan Tock Seng Hospital, we craft healing broths and nature-inspired meals that restore — not just sustain.')}
                                        as="textarea"
                                        className="text-charcoal/60 text-[16px] leading-[1.85]"
                                        isEditable={isEditable}
                                    />
                                </div>
                            </Fade>
                            <Fade delay={400}>
                                {/* Three micro-stats */}
                                <div className="flex gap-10 pt-4 border-t border-charcoal/10">
                                    {[
                                        { n: '24h', l: 'Slow-Simmered' },
                                        { n: '100%', l: 'Local Produce' },
                                        { n: '0', l: 'Refined Sugars' },
                                    ].map(stat => (
                                        <div key={stat.l}>
                                            <p className="playfair text-2xl font-semibold text-sage-rich">{stat.n}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mt-1">{stat.l}</p>
                                        </div>
                                    ))}
                                </div>
                            </Fade>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                         OUR STORY — Sage Green card over cafe interior
                    ══════════════════════════════════════════════════════ */}
                <section className="relative py-0">
                    <div className="relative h-[600px] lg:h-[720px] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?q=80&w=2670&auto=format&fit=crop"
                            alt="Warm cafe interior"
                            className="w-full h-full object-cover object-center"
                            style={{ filter: 'saturate(0.8) brightness(0.7)' }}
                        />
                        {/* Sage Rich overlapping card */}
                        <div className="absolute inset-0 flex items-center justify-center px-4">
                            <Fade className="w-full max-w-2xl">
                                <div
                                    className="rounded-[2.5rem] p-12 sm:p-16"
                                    style={{
                                        background: 'rgba(74, 103, 65, 0.9)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <p className="text-oatmeal/60 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                                        The Philosophy
                                    </p>
                                    <blockquote className="playfair text-2xl sm:text-[2rem] text-oatmeal leading-tight italic mb-8">
                                        <EditableText 
                                            settingKey="about_story_quote"
                                            initialValue={getSetting(s, 'about_story_quote', '"Healing, one bowl at a time."')}
                                            className="playfair text-oatmeal italic"
                                            isEditable={isEditable}
                                        />
                                    </blockquote>
                                    <div className="text-oatmeal/80 text-[15px] leading-[1.9]">
                                        <EditableText 
                                            settingKey="about_story_body"
                                            initialValue={getSetting(s, 'about_story_body', "Nette's Cafe isn't just about food; it's about recovery. In the busy halls of Tan Tock Seng Hospital, we provide a sanctuary of slow-simmered nutrition and calm — for patients, healthcare heroes, and the families standing beside them.")}
                                            as="textarea"
                                            className="text-oatmeal/80 text-[15px] leading-[1.9]"
                                            isEditable={isEditable}
                                        />
                                    </div>
                                    <div className="w-16 h-px bg-oatmeal/20 mt-10" />
                                </div>
                            </Fade>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                         24-HOUR PROCESS — Horizontal Visual Timeline
                    ══════════════════════════════════════════════════════ */}
                <section className="py-32 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Fade className="text-center mb-24">
                            <p className="text-terracotta font-bold uppercase tracking-[0.25em] text-[10px] mb-5">Handcrafted</p>
                            <h2 className="playfair text-4xl md:text-5xl text-charcoal tracking-tight">
                                24 Hours of Care
                            </h2>
                            <p className="text-charcoal/40 mt-5 text-[15px] max-w-sm mx-auto leading-relaxed">
                                Every bowl you receive is the result of a full day&apos;s dedication to healing.
                            </p>
                        </Fade>

                        <div className="relative flex flex-col md:flex-row gap-16 md:gap-0 mt-8">
                            {/* Horizontal line */}
                            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-gradient-to-r from-terracotta/20 via-sage-rich/30 to-terracotta/20" />

                            {[
                                {
                                    step: '01',
                                    title: 'Sourcing Local Farms',
                                    desc: 'Every morning we select seasonal produce from Singapore farms — ginger, turmeric, lemongrass, and beyond.',
                                    color: 'bg-terracotta',
                                },
                                {
                                    step: '02',
                                    title: '24-Hour Slow Simmer',
                                    desc: 'Bones and aromatics are gently simmered for a full 24 hours to extract maximum collagen, minerals, and deep flavour.',
                                    color: 'bg-sage-rich',
                                },
                                {
                                    step: '03',
                                    title: 'Nutrient-Dense Serving',
                                    desc: 'Served fresh — never frozen — to patients and visitors at peak nutritional potency, exactly when it&apos;s needed.',
                                    color: 'bg-terracotta',
                                },
                            ].map((item, i) => (
                                <Fade key={item.step} delay={i * 150} className="flex-1 flex flex-col items-center text-center px-6">
                                    <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center mb-8 text-white font-bold text-sm shadow-xl relative z-10 border-4 border-white`}>
                                        {item.step}
                                    </div>
                                    <h3 className="playfair text-xl text-charcoal mb-4 leading-snug">{item.title}</h3>
                                    <p className="text-charcoal/45 text-sm leading-relaxed max-w-[240px]">{item.desc}</p>
                                </Fade>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                         THREE PILLARS — Thin-line Terracotta icons
                    ══════════════════════════════════════════════════════ */}
                <section className="py-32 bg-oatmeal">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Fade className="text-center mb-20">
                            <p className="text-terracotta font-bold uppercase tracking-[0.25em] text-[10px] mb-5">Our Creed</p>
                            <h2 className="playfair text-4xl md:text-5xl text-charcoal tracking-tight">The Wellness Pillars</h2>
                        </Fade>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <IconFlame />,
                                    number: '01',
                                    title: 'Anti-Inflammatory',
                                    desc: 'Every ingredient is deliberately chosen to calm, restore, and protect. No hidden additives, no refined sugars — just honest nourishment.',
                                },
                                {
                                    icon: <IconDroplet />,
                                    number: '02',
                                    title: 'Nutrient Density',
                                    desc: 'Our 24-hour slow-simmer process extracts maximum collagen and minerals, delivering dense nutrition — especially critical during recovery.',
                                },
                                {
                                    icon: <IconLeaf />,
                                    number: '03',
                                    title: 'Mindful Preparation',
                                    desc: 'Made fresh daily from seasonal produce sourced from local farms within Singapore. No cold-chain shortcuts, no compromises.',
                                },
                            ].map((p, i) => (
                                <Fade key={p.number} delay={i * 120}>
                                    <div className="bg-white rounded-[2rem] p-10 flex flex-col gap-8 hover:shadow-2xl hover:shadow-sage-rich/10 hover:-translate-y-1 transition-all duration-500 group border border-charcoal/5">
                                        <div className="flex items-start justify-between">
                                            <div className="text-terracotta">{p.icon}</div>
                                            <span className="playfair font-bold text-charcoal/5 text-5xl">{p.number}</span>
                                        </div>
                                        <div>
                                            <h3 className="playfair text-xl text-charcoal mb-4 leading-snug">{p.title}</h3>
                                            <p className="text-charcoal/50 text-[14px] leading-relaxed mb-6">{p.desc}</p>
                                        </div>
                                        <div className="w-10 h-0.5 bg-sage-rich rounded-full group-hover:w-20 transition-all duration-500 mt-auto" />
                                    </div>
                                </Fade>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                         LOCATION SPOTLIGHT
                    ══════════════════════════════════════════════════════ */}
                <section className="py-32 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            {/* Photo with overlay */}
                            <Fade>
                                <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl shadow-sage-rich/20 group">
                                    <img
                                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2670&auto=format&fit=crop"
                                        alt="Hospital sanctuary area"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        style={{ filter: 'saturate(0.9) brightness(0.95)' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <p className="text-white playfair text-2xl leading-snug mb-2 drop-shadow-md">
                                            "Find us at #01-19,<br />where wellness meets convenience."
                                        </p>
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.25em]">TTSH Ward Block Taxi Stand</p>
                                    </div>
                                </div>
                            </Fade>

                            {/* Info Section */}
                            <Fade delay={100}>
                                <div className="flex flex-col gap-10">
                                    <div>
                                        <p className="text-terracotta font-bold uppercase tracking-[0.25em] text-[10px] mb-5">Visit Us</p>
                                        <h2 className="playfair text-4xl md:text-5xl text-charcoal tracking-tight leading-tight mb-6">
                                            A sanctuary in<br />the busy halls.
                                        </h2>
                                        <p className="text-charcoal/50 text-[16px] leading-[1.8] max-w-sm">
                                            Conveniently located at the Ward Block Taxi Stand — easy to reach for patients, staff, and visitors alike.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-5 p-6 rounded-2xl bg-oatmeal border border-charcoal/5">
                                            <div className="w-12 h-12 rounded-xl bg-sage-rich/10 flex items-center justify-center shrink-0">
                                                <MapPin size={20} className="text-sage-rich" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-charcoal text-sm">11 Jalan Tan Tock Seng #01-19</p>
                                                <p className="text-charcoal/50 text-xs mt-1">Tan Tock Seng Hospital, Singapore 308433</p>
                                                <p className="text-sage-rich text-[11px] font-bold mt-2 uppercase tracking-wide">Next to Ward Block Taxi Stand</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 rounded-2xl bg-oatmeal border border-charcoal/5">
                                                <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black mb-1.5">Phone</p>
                                                <a href="tel:+6580981919" className="text-charcoal font-bold text-sm hover:text-sage-rich transition">+65 8098 1919</a>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-oatmeal border border-charcoal/5">
                                                <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black mb-1.5">Hours</p>
                                                <p className="text-charcoal font-bold text-sm">Mon–Wed 9–5</p>
                                                <p className="text-charcoal/30 text-[10px] mt-0.5">Thu–Sun Closed</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <a
                                            href="https://maps.google.com/?q=11+Jalan+Tan+Tock+Seng+%2301-19+Singapore+308433"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-8 py-4 rounded-full bg-deep-moss text-white font-bold text-sm hover:translate-x-1 transition-all shadow-xl shadow-deep-moss/20 hover:shadow-deep-moss/30 inline-flex items-center gap-2"
                                        >
                                            <MapPin size={16} /> Get Directions
                                        </a>
                                        <Link
                                            href="/contact"
                                            className="px-8 py-4 rounded-full border-2 border-deep-moss/20 text-deep-moss font-bold text-sm hover:bg-deep-moss/5 transition-all"
                                        >
                                            Contact Us
                                        </Link>
                                    </div>
                                </div>
                            </Fade>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════
                         PULL QUOTE — Sage Rich
                    ══════════════════════════════════════════════════════ */}
                <section className="py-28 bg-sage-rich relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05] grayscale"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2853&auto=format&fit=crop')", backgroundSize: 'cover' }} />
                    <Fade className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                        <p className="text-white/30 text-6xl playfair mb-4">&ldquo;</p>
                        <blockquote className="playfair text-3xl md:text-[2.6rem] text-white leading-tight italic px-4">
                            Eat food that was alive once.
                        </blockquote>
                        <div className="w-16 h-px bg-white/30 mx-auto my-10" />
                        <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.3em]">— Nette&apos;s Nutritional Creed</p>
                    </Fade>
                </section>

                {/* ══════════════════════════════════════════════════════
                         BOTTOM CTA
                    ══════════════════════════════════════════════════════ */}
                <section className="py-32 bg-oatmeal text-center">
                    <div className="max-w-2xl mx-auto px-4">
                        <Fade>
                            <p className="text-terracotta text-xs font-bold mb-6 uppercase tracking-[0.25em]">
                                Start your recovery
                            </p>
                            <h2 className="playfair text-4xl md:text-[3.2rem] text-charcoal tracking-tight mb-12 leading-tight">
                                Ready to experience<br />healing nutrition?
                            </h2>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <Link
                                    href="/menu"
                                    className="px-10 py-5 rounded-full bg-deep-moss text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-deep-moss/30 inline-flex items-center gap-3"
                                >
                                    Explore the Menu <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-10 py-5 rounded-full border-2 border-deep-moss/30 text-deep-moss font-bold text-sm hover:bg-deep-moss/10 transition-all"
                                >
                                    Find a Table
                                </Link>
                            </div>
                        </Fade>
                    </div>
                </section>

            </div>
        </>
    )
}
