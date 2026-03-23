/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Config } from '@puckeditor/core'
import { ArrowRight, Leaf, CheckCircle2, Star, Wheat, HeartPulse, CalendarCheck } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Nette Hero Section (matches the existing home page aesthetic)
// ─────────────────────────────────────────────────────────────────────────────
type NetteHeroProps = {
    tagline: string
    title: string
    subtitle: string
    ctaLabel: string
    ctaHref: string
    secondaryLabel: string
    secondaryHref: string
    backgroundImage: string
}

const NetteHero = ({ tagline, title, subtitle, ctaLabel, ctaHref, secondaryLabel, secondaryHref, backgroundImage }: NetteHeroProps) => (
    <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${backgroundImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D2D2D]/80 via-[#2D2D2D]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/60 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col items-start gap-6">
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7D8E74]/30 text-[#F9F7F2] text-sm font-semibold border border-[#7D8E74]/40 backdrop-blur-sm">
                <Leaf size={13} /> {tagline}
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-white leading-[1.05] tracking-tight max-w-2xl">{title}</h1>
            <p className="text-base md:text-lg text-white/80 max-w-md leading-relaxed font-medium">{subtitle}</p>
            <div className="flex flex-wrap gap-3 mt-2">
                <a href={ctaHref} className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#7D8E74] text-white font-bold text-sm hover:bg-[#5a6b52] transition shadow-lg shadow-black/20">
                    {ctaLabel} <ArrowRight size={16} />
                </a>
                <a href={secondaryHref} className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/15 text-white font-bold text-sm hover:bg-white/25 transition border border-white/30 backdrop-blur-sm">
                    <CalendarCheck size={16} /> {secondaryLabel}
                </a>
            </div>
        </div>
    </section>
)

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Health Hub Bento Grid
// ─────────────────────────────────────────────────────────────────────────────
type HealthHubProps = {
    sectionTag: string
    heading: string
    subtitle: string
    card1Tag: string
    card1Title: string
    card1Body: string
    card2Title: string
    card2Body: string
    card2Link: string
    quoteText: string
    quoteImage: string
}

const HealthHub = ({ sectionTag, heading, subtitle, card1Tag, card1Title, card1Body, card2Title, card2Body, card2Link, quoteText, quoteImage }: HealthHubProps) => (
    <section className="py-24 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#7D8E74] mb-3">{sectionTag}</p>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2D2D2D] tracking-tight max-w-xl">{heading}</h2>
                <p className="mt-4 text-[#2D2D2D]/60 text-lg font-medium max-w-lg">{subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1 — Farm-to-Table */}
                <div className="md:row-span-2 bg-white rounded-3xl p-8 border border-stone-200/80 flex flex-col gap-5 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-[#7D8E74]/10 flex items-center justify-center">
                        <Wheat size={24} className="text-[#7D8E74]" />
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#7D8E74] mb-2">{card1Tag}</p>
                        <h3 className="font-serif text-2xl text-[#2D2D2D] leading-snug mb-3">{card1Title}</h3>
                        <p className="text-[#2D2D2D]/60 text-sm leading-relaxed">{card1Body}</p>
                    </div>
                    <div className="mt-auto grid grid-cols-2 gap-3">
                        {['Local Farms', 'Seasonal', 'Zero Preservatives', 'Daily Fresh'].map(tag => (
                            <span key={tag} className="px-3 py-1.5 rounded-xl bg-[#7D8E74]/8 text-[#5a6b52] text-xs font-semibold text-center">{tag}</span>
                        ))}
                    </div>
                </div>
                {/* Card 2 — Image */}
                <div className="md:col-span-2 relative rounded-3xl overflow-hidden" style={{ minHeight: '280px', aspectRatio: '16/9' }}>
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${quoteImage}')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/75 via-[#2D2D2D]/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <p className="font-serif text-2xl text-white leading-snug max-w-xs">"{quoteText}"</p>
                        <p className="text-white/60 text-xs mt-1.5 font-medium">— Nette's Nutritional Creed</p>
                    </div>
                </div>
                {/* Card 3 — Dish of Day */}
                <div className="md:col-span-2 bg-[#2D2D2D] rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-[#7D8E74]/20 flex items-center justify-center shrink-0">
                        <HeartPulse size={24} className="text-[#a3b39b]" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#7D8E74]">Nutrition</p>
                        <h3 className="font-serif text-2xl text-white leading-snug">{card2Title}</h3>
                        <p className="text-stone-400 text-sm leading-relaxed">{card2Body}</p>
                        <a href="/menu" className="mt-3 w-fit flex items-center gap-1.5 text-[#7D8E74] text-sm font-semibold hover:text-[#a3b39b] transition">
                            {card2Link} <ArrowRight size={14} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Stats Strip
// ─────────────────────────────────────────────────────────────────────────────
type StatsStripProps = {
    stat1: string
    stat2: string
    stat3: string
    bgColor: string
}

const StatsStrip = ({ stat1, stat2, stat3, bgColor }: StatsStripProps) => (
    <div style={{ backgroundColor: bgColor }} className="py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-6 justify-around">
            {[
                { icon: <Leaf size={14} className="text-[#7D8E74]" />, label: stat1 },
                { icon: <CheckCircle2 size={14} className="text-[#7D8E74]" />, label: stat2 },
                { icon: <Star size={14} className="text-[#7D8E74]" />, label: stat3 },
            ].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm font-semibold text-[#2D2D2D]">
                    <span className="w-7 h-7 rounded-full bg-[#7D8E74]/12 flex items-center justify-center">{s.icon}</span>
                    {s.label}
                </div>
            ))}
        </div>
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Call to Action Banner
// ─────────────────────────────────────────────────────────────────────────────
type CTABannerProps = {
    tag: string
    heading: string
    subtitle: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
}

const CTABanner = ({ tag, heading, subtitle, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: CTABannerProps) => (
    <section className="relative py-28 overflow-hidden bg-[#F9F7F2]">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, #7D8E7430 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, #7D8E7420 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#7D8E74] mb-4">{tag}</p>
            <h2 className="font-serif text-5xl md:text-6xl text-[#2D2D2D] tracking-tight mb-5">{heading}</h2>
            <p className="text-[#2D2D2D]/60 text-lg mb-8 font-medium max-w-md mx-auto">{subtitle}</p>
            <div className="flex flex-wrap gap-3 justify-center">
                <a href={primaryHref} className="px-8 py-4 rounded-full bg-[#2D2D2D] text-white font-bold text-sm hover:bg-[#7D8E74] transition shadow-lg shadow-black/15">
                    {primaryLabel}
                </a>
                <a href={secondaryHref} className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#7D8E74]/12 text-[#5a6b52] font-bold text-sm hover:bg-[#7D8E74]/20 transition border border-[#7D8E74]/25">
                    <CalendarCheck size={16} /> {secondaryLabel}
                </a>
            </div>
        </div>
    </section>
)

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Rich Text Block (inline editable)
// ─────────────────────────────────────────────────────────────────────────────
type RichTextProps = {
    content: string
    fontSize: string
    fontWeight: string
    textAlign: string
    color: string
    maxWidth: string
    paddingY: number
}

const RichText = ({ content, fontSize, fontWeight, textAlign, color, maxWidth, paddingY }: RichTextProps) => (
    <div className="px-6" style={{ paddingTop: paddingY, paddingBottom: paddingY }}>
        <p
            className={`${fontSize} ${fontWeight} ${textAlign} leading-relaxed whitespace-pre-line mx-auto`}
            style={{ color, maxWidth: maxWidth || '800px' }}
        >
            {content}
        </p>
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Image Block
// ─────────────────────────────────────────────────────────────────────────────
type ImageBlockProps = {
    src: string
    alt: string
    caption: string
    borderRadius: string
    maxWidth: string
    aspectRatio: string
}

const ImageBlock = ({ src, alt, caption, borderRadius, maxWidth, aspectRatio }: ImageBlockProps) => (
    <div className="px-6 py-4 flex flex-col items-center">
        <div style={{ maxWidth, width: '100%' }}>
            <img
                src={src}
                alt={alt}
                className="w-full object-cover shadow-xl shadow-stone-200/50 border border-stone-100"
                style={{ borderRadius, aspectRatio: aspectRatio || 'auto' }}
            />
            {caption && <p className="text-stone-400 text-sm text-center mt-3 italic">{caption}</p>}
        </div>
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Spacer / Divider
// ─────────────────────────────────────────────────────────────────────────────
type SpacerProps = { height: number; showLine: boolean; lineColor: string }

const Spacer = ({ height, showLine, lineColor }: SpacerProps) => (
    <div style={{ height, display: 'flex', alignItems: 'center', padding: '0 24px' }} aria-hidden="true">
        {showLine && <hr style={{ width: '100%', borderColor: lineColor, borderTopWidth: 1 }} />}
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// PUCK CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const puckConfig: Config = {
    components: {
        NetteHero: {
            label: '🦸 Hero Section',
            fields: {
                tagline: { type: 'text', label: 'Tagline Pill' },
                title: { type: 'text', label: 'Main Headline' },
                subtitle: { type: 'textarea', label: 'Subtitle' },
                ctaLabel: { type: 'text', label: 'Primary Button' },
                ctaHref: { type: 'text', label: 'Primary Button Link' },
                secondaryLabel: { type: 'text', label: 'Secondary Button' },
                secondaryHref: { type: 'text', label: 'Secondary Button Link' },
                backgroundImage: { type: 'text', label: 'Background Image URL' },
            },
            defaultProps: {
                tagline: 'Farm-Fresh · Wholesome',
                title: 'Wellness in Every Sip.',
                subtitle: "Nette's Cafe brings farm-fresh ingredients, healing broths, and nature-inspired nutrition to every plate — crafted for your wellbeing.",
                ctaLabel: 'Explore Menu',
                ctaHref: '/menu',
                secondaryLabel: 'Book a Table',
                secondaryHref: '/contact',
                backgroundImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2853&auto=format&fit=crop',
            },
            render: NetteHero as any,
        },

        HealthHub: {
            label: '🌿 Health Hub Cards',
            fields: {
                sectionTag: { type: 'text', label: 'Section Tag' },
                heading: { type: 'text', label: 'Section Heading' },
                subtitle: { type: 'textarea', label: 'Section Subtitle' },
                card1Tag: { type: 'text', label: 'Card 1 Tag' },
                card1Title: { type: 'text', label: 'Card 1 Heading' },
                card1Body: { type: 'textarea', label: 'Card 1 Body' },
                card2Title: { type: 'text', label: 'Card 2 Heading' },
                card2Body: { type: 'textarea', label: 'Card 2 Body' },
                card2Link: { type: 'text', label: 'Card 2 Link Label' },
                quoteText: { type: 'text', label: 'Image Quote' },
                quoteImage: { type: 'text', label: 'Quote Image URL' },
            },
            defaultProps: {
                sectionTag: 'Our Philosophy',
                heading: 'The Health Hub',
                subtitle: 'Where mindful eating meets unforgettable flavour.',
                card1Tag: 'Sourcing',
                card1Title: 'Farm-to-Table Sourcing',
                card1Body: 'We partner with local farms within 50 km of our kitchen. Every morning, fresh produce arrives — no cold-chain shortcuts, just honest ingredients picked at peak nutrition.',
                card2Title: 'Dish of the Day',
                card2Body: 'Our philosophy is simple: food is medicine. Each dish is designed by our nutritionist to deliver macro-balance, gut-friendly fibre, and anti-inflammatory superfoods.',
                card2Link: "See Today's Menu",
                quoteText: 'Eat food that was alive once.',
                quoteImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop',
            },
            render: HealthHub as any,
        },

        StatsStrip: {
            label: '📊 Stats Strip',
            fields: {
                stat1: { type: 'text', label: 'Stat 1' },
                stat2: { type: 'text', label: 'Stat 2' },
                stat3: { type: 'text', label: 'Stat 3' },
                bgColor: { type: 'text', label: 'Background Color' },
            },
            defaultProps: {
                stat1: 'Farm-Fresh Daily',
                stat2: '100% Natural',
                stat3: 'No Additives',
                bgColor: '#F9F7F2',
            },
            render: StatsStrip as any,
        },

        CTABanner: {
            label: '📣 Call to Action Banner',
            fields: {
                tag: { type: 'text', label: 'Section Tag' },
                heading: { type: 'text', label: 'Heading' },
                subtitle: { type: 'textarea', label: 'Subtitle' },
                primaryLabel: { type: 'text', label: 'Primary Button' },
                primaryHref: { type: 'text', label: 'Primary Button Link' },
                secondaryLabel: { type: 'text', label: 'Secondary Button' },
                secondaryHref: { type: 'text', label: 'Secondary Button Link' },
            },
            defaultProps: {
                tag: 'Get Started',
                heading: 'Ready to eat well?',
                subtitle: 'Choose eat-in or takeaway. Every meal, made with intention.',
                primaryLabel: 'Start Your Order',
                primaryHref: '/menu',
                secondaryLabel: 'Book a Table',
                secondaryHref: '/contact',
            },
            render: CTABanner as any,
        },

        RichText: {
            label: '📝 Rich Text',
            fields: {
                content: { type: 'textarea', label: 'Content' },
                fontSize: {
                    type: 'select', label: 'Font Size',
                    options: [
                        { label: 'Small (sm)', value: 'text-sm' },
                        { label: 'Base', value: 'text-base' },
                        { label: 'Large (lg)', value: 'text-lg' },
                        { label: 'XL', value: 'text-xl' },
                        { label: '2XL', value: 'text-2xl' },
                        { label: '4XL — Section Heading', value: 'text-4xl' },
                        { label: '6XL — Display', value: 'text-6xl' },
                    ]
                },
                fontWeight: {
                    type: 'select', label: 'Weight',
                    options: [
                        { label: 'Normal', value: 'font-normal' },
                        { label: 'Semibold', value: 'font-semibold' },
                        { label: 'Bold', value: 'font-bold' },
                        { label: 'Black', value: 'font-black' },
                    ]
                },
                textAlign: {
                    type: 'select', label: 'Alignment',
                    options: [
                        { label: 'Left', value: 'text-left' },
                        { label: 'Center', value: 'text-center' },
                        { label: 'Right', value: 'text-right' },
                    ]
                },
                color: { type: 'text', label: 'Text Color' },
                maxWidth: { type: 'text', label: 'Max Width (e.g. 800px)' },
                paddingY: { type: 'number', label: 'Vertical Padding (px)' },
            },
            defaultProps: {
                content: 'Add your text here. Click to edit in the panel on the right.',
                fontSize: 'text-base',
                fontWeight: 'font-normal',
                textAlign: 'text-left',
                color: '#2D2D2D',
                maxWidth: '800px',
                paddingY: 16,
            },
            render: RichText as any,
        },

        ImageBlock: {
            label: '🖼️ Image',
            fields: {
                src: { type: 'text', label: 'Image URL' },
                alt: { type: 'text', label: 'Alt Text' },
                caption: { type: 'text', label: 'Caption (optional)' },
                borderRadius: { type: 'text', label: 'Corner Radius' },
                maxWidth: { type: 'text', label: 'Max Width' },
                aspectRatio: { type: 'text', label: 'Aspect Ratio (e.g. 16/9)' },
            },
            defaultProps: {
                src: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&q=80',
                alt: 'Beautiful cafe food',
                caption: '',
                borderRadius: '1.5rem',
                maxWidth: '100%',
                aspectRatio: '16/9',
            },
            render: ImageBlock as any,
        },

        Spacer: {
            label: '↕ Spacer / Divider',
            fields: {
                height: { type: 'number', label: 'Height (px)' },
                showLine: { type: 'radio', label: 'Show Divider Line', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] },
                lineColor: { type: 'text', label: 'Line Color' },
            },
            defaultProps: { height: 64, showLine: false, lineColor: '#e7e5e4' },
            render: Spacer as any,
        },
    },
}
