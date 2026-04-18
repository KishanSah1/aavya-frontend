import HeroSection from './components/home/HeroSection'
import TrustBar from './components/home/TrustBar'
import StorySection from './components/home/StorySection'
import BestSellers from './components/home/BestSellers'
import WhyChooseSection from './components/home/WhyChooseSection'
import CertificationsSection from './components/home/CertificationsSection'
import TestimonialsSection from './components/home/TestimonialsSection'
import FAQSection from './components/home/FAQSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <StorySection />
      <BestSellers />
      <WhyChooseSection />
      <CertificationsSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}
