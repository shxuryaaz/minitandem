import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const stats = [
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: Zap, value: "95%", label: "Faster Onboarding" },
    { icon: Sparkles, value: "4.9/5", label: "User Rating" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3f4f6%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl"
          >
            Transform Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Onboarding
            </span>{" "}
            with MiniTandem
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl"
          >
            Reduce time-to-value by 95% with MiniTandem's intelligent guidance, personalized experiences, 
            and automated workflows that turn trial users into paying customers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={() => navigate("/login")}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold ring-1 ring-gray-300 hover:bg-gray-50 dark:ring-gray-600 dark:hover:bg-gray-800"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.p
            variants={itemVariants}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400"
          >
            No credit card required • 14-day free trial • Setup in 5 minutes
          </motion.p>
        </motion.div>

        {/* Hero Image/Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-700 dark:to-gray-800">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Mock Dashboard Cards */}
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="h-32 rounded-lg bg-blue-100 dark:bg-blue-900/30" />
                    <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="h-32 rounded-lg bg-purple-100 dark:bg-purple-900/30" />
                    <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600" />
                    <div className="h-32 rounded-lg bg-green-100 dark:bg-green-900/30" />
                    <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
