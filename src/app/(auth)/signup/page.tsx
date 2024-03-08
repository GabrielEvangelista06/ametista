import { SignupForm } from '@/app/(auth)/_components/SignupForm'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function AuthPage() {
  return (
    <div className="text-center">
      <Header />

      <main className="m-6 lg:m-0 2xl:m-20">
        <SignupForm />
      </main>

      <Footer />
    </div>
  )
}
