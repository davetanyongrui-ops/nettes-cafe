import MenuItemForm from '@/components/admin/forms/MenuItemForm'

export default function NewMenuItemPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-emerald-950 tracking-tight mb-2">Add New Item</h1>
                <p className="text-stone-500 font-medium">Create a new item for the menu or salad bar.</p>
            </div>
            <MenuItemForm />
        </div>
    )
}
