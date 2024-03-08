import { LoginForm } from '@/app/(auth)/_components/LoginForm'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function LoginPage() {
  return (
    <div className="text-center">
      <Header />

      <main className="md:mt-10 lg:mt-0 2xl:mt-16">
        <LoginForm />
      </main>

      <Footer />
    </div>
  )
}
