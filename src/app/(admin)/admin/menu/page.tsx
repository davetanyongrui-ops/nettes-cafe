import MenuView from '@/components/views/MenuView'

export const metadata = { title: 'Admin – Edit Menu | Nette\'s Cafe' }

export default function AdminMenuPage() {
    return (
        <div>
            <div className="mb-6 pb-4 border-b border-stone-200">
                <h1 className="text-2xl font-black text-stone-900">Edit Menu Page</h1>
                <p className="text-stone-500 text-sm mt-1">Click the Menu title and subtitle below to edit them. Use Menu Editor for individual items.</p>
            </div>
            <MenuView isEditable={true} />
        </div>
    )
}
