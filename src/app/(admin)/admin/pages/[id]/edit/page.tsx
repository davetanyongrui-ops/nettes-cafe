import PuckEditorClient from './PuckEditorClient'

// This page is the ONLY place where the Puck editor is active.
// Access it via /admin/pages/{id}/edit
type Props = { params: Promise<{ id: string }> }

export default async function PageEditRoute({ params }: Props) {
    const { id } = await params
    return (
        // Remove the default admin layout padding — Puck needs full screen
        <div className="fixed inset-0 z-50 bg-[#F9F7F2]">
            <PuckEditorClient pageId={id} />
        </div>
    )
}
