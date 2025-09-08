import { motion } from "framer-motion";
import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-25 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
}
