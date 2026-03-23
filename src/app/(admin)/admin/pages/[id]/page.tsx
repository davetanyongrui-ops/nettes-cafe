import { redirect } from 'next/navigation'

// The page-level editor has moved to the dedicated /edit route.
// This redirect ensures all existing links from the pages list still work.
type Props = { params: Promise<{ id: string }> }

export default async function PageEditorRedirect({ params }: Props) {
    const { id } = await params
    redirect(`/admin/pages/${id}/edit`)
}
