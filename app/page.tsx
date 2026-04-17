import HeroSection from './components/home/HeroSection'
import ProductsScrollSection from './components/home/ProductsScrollSection'
import TrustBar from './components/home/TrustBar'
import StorySection from './components/home/StorySection'
import BestSellers from './components/home/BestSellers'
import WhyChooseSection from './components/home/WhyChooseSection'
import TestimonialsSection from './components/home/TestimonialsSection'
import FAQSection from './components/home/FAQSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductsScrollSection />
      <TrustBar />
      <StorySection />
      <BestSellers />
      <WhyChooseSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}
