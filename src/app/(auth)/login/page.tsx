import { LoginForm } from '@/app/(auth)/_components/LoginForm'
import { Header } from '@/components/Header'

export default function LoginPage() {
  return (
    <div className="text-center">
      <Header />

      <main>
        <LoginForm />
      </main>
    </div>
  )
}
