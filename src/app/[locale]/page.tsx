import { Hero } from "@/components/home/hero";
import { ProofBar } from "@/components/home/proof-bar";
import { WhatWeDo } from "@/components/home/what-we-do";
import { TopCategories } from "@/components/home/top-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HowItWorksPreview } from "@/components/home/how-it-works-preview";
import { WhyMarassi } from "@/components/home/why-marassi";
import { CTABand } from "@/components/home/cta-band";
import { TrustedMarkets } from "@/components/home/trusted-markets";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofBar />
      <WhatWeDo />
      <TopCategories />
      <FeaturedProducts />
      <TrustedMarkets />
      <HowItWorksPreview />
      <WhyMarassi />
      <CTABand />
    </>
  );
}
