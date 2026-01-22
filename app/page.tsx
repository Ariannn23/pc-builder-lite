import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Inspiration from "@/components/landing/Inspiration";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden cursor-default">
      <Hero />
      <HowItWorks />
      <Inspiration />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTA /> {/* Ahora debería renderizar correctamente */}
      <Footer />
    </div>
  );
}
