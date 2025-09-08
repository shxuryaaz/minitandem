import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const benefits = [
  "14-day free trial",
  "No credit card required",
  "Setup in 5 minutes",
  "24/7 support included",
];

export function CTA() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Limited Time: 50% off first 3 months
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Ready to transform your{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              user onboarding?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-8 text-blue-100 sm:text-xl"
          >
            Join thousands of companies already using AI Onboarding Copilot to reduce churn, 
            increase activation, and accelerate time-to-value.
          </motion.p>

          {/* Benefits */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-blue-100">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl"
              onClick={() => navigate("/login")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold text-white ring-1 ring-white/30 hover:bg-white/10"
            >
              Schedule Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-8"
          >
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 ring-2 ring-white"
                  />
                ))}
              </div>
              <span className="text-sm">Join 10,000+ companies</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-3 w-3 rounded-full bg-yellow-300" />
                ))}
              </div>
              <span className="text-sm">4.9/5 rating</span>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="mt-12"
          >
            <p className="text-sm text-blue-200">
              "AI Onboarding Copilot reduced our time-to-value by 80%. It's been a game-changer for our business."
            </p>
            <p className="mt-2 text-xs text-blue-300">
              — Sarah Chen, Head of Product at Aircall
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
    </section>
  );
}
