import { redirect } from 'next/navigation'

// /admin/editor is superseded by /admin/home — redirect there
export default function LegacyEditorPage() {
  redirect('/admin/home')
}
