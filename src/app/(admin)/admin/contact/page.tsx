import ContactView from '@/components/views/ContactView'

export const metadata = { title: 'Admin – Edit Contact | Nette\'s Cafe' }

export default function AdminContactPage() {
    return (
        <div>
            <div className="mb-6 pb-4 border-b border-stone-200">
                <h1 className="text-2xl font-black text-stone-900">Edit Contact Page</h1>
                <p className="text-stone-500 text-sm mt-1">Click any text below to edit it. Changes save instantly to the database.</p>
            </div>
            <ContactView isEditable={true} />
        </div>
    )
}
