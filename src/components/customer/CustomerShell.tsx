'use client'

import { Suspense, useState } from 'react'
import Header from '@/components/customer/Header'
import CartSidebar from '@/components/customer/CartSidebar'
import Footer from '@/components/customer/Footer'

type FooterData = { cafeName: string; tagline: string; copyright: string; phone: string; email: string; address: string; igHandle: string; fbName: string; }
type HeaderData = { logoText: string; navHome: string; navAbout: string; navMenu: string; navContact: string; bookBtn: string }
type CustomPageLink = { id: string; title: string; slug: string }

export default function CustomerShell({
    children,
    footerData,
    headerData,
    customPages = [],
    isEditable = false,
}: {
    children: React.ReactNode
    footerData: FooterData
    headerData: HeaderData
    customPages?: CustomPageLink[]
    isEditable?: boolean
}) {
    const [cartOpen, setCartOpen] = useState(false)

    return (
        <Suspense>
            <Header onCartOpen={() => setCartOpen(true)} customPages={customPages} headerData={headerData} />
            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
            {children}
            <Footer
                footerData={footerData}
                headerData={headerData}
            />
        </Suspense>
    )
}
