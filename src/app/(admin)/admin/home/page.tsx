import HomeView from '@/components/views/HomeView'

export const metadata = { title: 'Admin – Edit Home | Nette\'s Cafe' }

export default function AdminHomePage() {
    return (
        <div>
            <div className="mb-6 pb-4 border-b border-stone-200">
                <h1 className="text-2xl font-black text-stone-900">Edit Home Page</h1>
                <p className="text-stone-500 text-sm mt-1">Click any text below to edit it. Changes save instantly to the database.</p>
            </div>
            <HomeView isEditable={true} />
        </div>
    )
}
