import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Inspiration from "@/components/landing/Inspiration";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function LandingPage() {
  const featuredBuilds = await prisma.build.findMany({
    where: { isFeatured: true },
    include: {
      buildItems: { include: { product: true } },
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden cursor-default">
      <Hero />
      <HowItWorks />
      <Inspiration builds={featuredBuilds} />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
