import { Hero } from '@/components/Hero'
import { Header } from '@/components/LandingPageHeader'

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto overflow-hidden px-4 md:overflow-visible">
        <Hero />
      </div>
    </>
  )
}
