import { SignupForm } from '@/app/(auth)/_components/SignupForm'
import { Header } from '@/components/Header'

export default function AuthPage() {
  return (
    <div className="text-center">
      <Header />

      <main className="m-5">
        <SignupForm />
      </main>
    </div>
  )
}
