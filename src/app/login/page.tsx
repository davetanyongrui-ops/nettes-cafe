import { redirect } from 'next/navigation'

// Alias /login → /admin/login so middleware redirect lands on the real login form
export default function LoginPage() {
    redirect('/admin/login')
}
