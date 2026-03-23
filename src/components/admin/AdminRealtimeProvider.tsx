'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'

// A simple base64 encoded "ding" sound for notifications
const DING_SOUND = 'data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'

function NotificationToast({
    message,
    onClose
}: {
    message: string,
    onClose: () => void
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className="bg-emerald-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="bg-emerald-500/30 p-2 rounded-full shrink-0">
                <Bell size={20} className="text-white animate-pulse" />
            </div>
            <div className="flex-1">
                <p className="font-bold text-sm">New Order!</p>
                <p className="text-emerald-50 text-xs">{message}</p>
            </div>
            <button onClick={onClose} className="text-emerald-200 hover:text-white transition ml-2 shrink-0">
                <span className="sr-only">Close</span>✕
            </button>
        </div>
    )
}

export function AdminRealtimeProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<{ id: string, message: string }[]>([])

    useEffect(() => {
        const supabase = createClient()

        // Listen to new inserts on the orders table
        const channel = supabase
            .channel('public:orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    // console.log('New order received!', payload)

                    // Add notification to state
                    const newId = (payload.new as any).id || crypto.randomUUID()
                    setNotifications(prev => [...prev, {
                        id: newId,
                        message: `Order #${(payload.new as any).id.substring(0, 6).toUpperCase()} has just arrived.`,
                    }])

                    // Play sound
                    try {
                        const audio = new Audio(DING_SOUND)
                        audio.play().catch(e => console.log('Audio play blocked', e))
                    } catch (err) {
                        console.error('Failed to play sound', err)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    return (
        <>
            {children}
            {/* Render notifications stacked */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
                {notifications.map(n => (
                    <NotificationToast
                        key={n.id}
                        message={n.message}
                        onClose={() => removeNotification(n.id)}
                    />
                ))}
            </div>
        </>
    )
}
