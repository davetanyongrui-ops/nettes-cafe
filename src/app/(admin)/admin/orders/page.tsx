'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Clock, ChefHat, CheckSquare, PackageCheck } from 'lucide-react'

export default function LiveOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        const { data: fetchedOrders, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .neq('status', 'completed')
            .order('created_at', { ascending: true })

        if (fetchedOrders) setOrders(fetchedOrders)
        setLoading(false)
    }

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        // Optimistic update
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

        await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        fetchOrders()
    }

    const getStatusColumn = (status: string, title: string, icon: any, colorClass: string) => {
        const columnOrders = orders.filter(o => o.status === status)

        return (
            <div className={`flex flex-col rounded-3xl overflow-hidden border ${colorClass} bg-white shadow-sm h-[calc(100vh-200px)]`}>
                <div className={`p-4 font-bold flex items-center gap-2 justify-between border-b ${colorClass} bg-opacity-20`}>
                    <div className="flex items-center gap-2">
                        {icon} {title}
                    </div>
                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs box-content border border-opacity-20 border-current backdrop-blur-sm">{columnOrders.length}</span>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-stone-50/50">
                    {columnOrders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-3">
                                <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded border border-stone-200">
                                    #{order.id.slice(0, 5).toUpperCase()}
                                </span>
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase bg-opacity-10 border ${order.order_type === 'eat-in' ? 'bg-blue-500 text-blue-700 border-blue-200' : 'bg-orange-500 text-orange-700 border-orange-200'}`}>
                                    {order.order_type}
                                </span>
                            </div>

                            <ul className="text-sm space-y-3 mb-5 border-y border-stone-100 py-3">
                                {order.order_items.map((item: any, i: number) => (
                                    <li key={i} className="flex gap-3 text-stone-700 font-medium items-start">
                                        <span className="font-bold bg-stone-100 px-2 py-0.5 rounded text-xs">{item.quantity}x</span>
                                        <div className="flex-1">
                                            {item.item_name}
                                            {item.category === 'salad_custom' && item.customizations && (
                                                <div className="text-xs text-stone-500 mt-1.5 font-normal bg-stone-50 border border-stone-100 p-2 rounded-lg">
                                                    <span className="font-semibold">{item.customizations.base?.name}</span>
                                                    <div className="mt-1 pl-2 border-l-2 border-emerald-200">
                                                        {item.customizations.proteins?.length > 0 && <p className="mb-0.5"><span className="opacity-70">Prot:</span> {item.customizations.proteins?.map((p: any) => p.name).join(', ')}</p>}
                                                        {item.customizations.dressings?.length > 0 && <p className="mb-0.5"><span className="opacity-70">Drss:</span> {item.customizations.dressings?.map((d: any) => d.name).join(', ')}</p>}
                                                        {item.customizations.toppings?.length > 0 && <p><span className="opacity-70">Topp:</span> {item.customizations.toppings?.map((t: any) => t.name).join(', ')}</p>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex gap-2 mt-4">
                                {status === 'pending' && (
                                    <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="flex-1 py-3 bg-stone-900 border border-stone-800 text-white text-xs font-bold rounded-xl hover:bg-stone-800 shadow-md transition-transform active:scale-95">
                                        Start Prep
                                    </button>
                                )}
                                {status === 'preparing' && (
                                    <button onClick={() => updateOrderStatus(order.id, 'ready')} className="flex-1 py-3 bg-emerald-600 border border-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-transform active:scale-95 shadow-emerald-600/20">
                                        Mark Ready
                                    </button>
                                )}
                                {status === 'ready' && (
                                    <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex-1 py-3 border-2 border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-transform active:scale-95">
                                        Complete Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {columnOrders.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-stone-400 p-6 text-center">
                            <span className="block mb-3 opacity-30">{icon}</span>
                            <p className="text-sm font-medium">No orders {title.toLowerCase()}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-emerald-950 tracking-tight mb-2">Live Orders Monitor</h1>
                    <p className="text-stone-500 font-medium">Manage incoming orders and kitchen workflow.</p>
                </div>
                <button className="px-6 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-bold shadow-sm hover:bg-stone-50 transition hover:shadow flex items-center gap-2 text-stone-700" onClick={fetchOrders}>
                    <Clock size={16} /> Refresh Board
                </button>
            </div>

            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin text-emerald-600"><ChefHat size={48} /></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {getStatusColumn('pending', 'Pending', <Clock size={18} />, 'border-orange-200 text-orange-800')}
                    {getStatusColumn('preparing', 'Kitchen Prepping', <ChefHat size={18} />, 'border-blue-200 text-blue-800')}
                    {getStatusColumn('ready', 'Ready for Collection', <PackageCheck size={18} />, 'border-emerald-200 text-emerald-800')}
                </div>
            )}
        </div>
    )
}
