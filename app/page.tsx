import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HeroSection from './components/home/HeroSection'
import ProductsScrollSection from './components/home/ProductsScrollSection'
import TrustBar from './components/home/TrustBar'
import StorySection from './components/home/StorySection'
import BestSellers from './components/home/BestSellers'
import WhyChooseSection from './components/home/WhyChooseSection'
import TestimonialsSection from './components/home/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProductsScrollSection />
        <TrustBar />
        <StorySection />
        <BestSellers />
        <WhyChooseSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
