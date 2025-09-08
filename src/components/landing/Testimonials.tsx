import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    content: "AI Onboarding Copilot reduced our time-to-value by 80%. New users now understand our platform in minutes instead of hours.",
    author: "Sarah Chen",
    role: "Head of Product",
    company: "Aircall",
    avatar: "SC",
    rating: 5,
  },
  {
    content: "The personalized onboarding flows have been a game-changer. Our trial-to-paid conversion rate increased by 45% in just 3 months.",
    author: "Marcus Rodriguez",
    role: "VP of Growth",
    company: "Spendesk",
    avatar: "MR",
    rating: 5,
  },
  {
    content: "Finally, an onboarding solution that actually works. The AI guidance is so intuitive that our support tickets dropped by 60%.",
    author: "Emily Watson",
    role: "Customer Success Manager",
    company: "Notion",
    avatar: "EW",
    rating: 5,
  },
];

const companies = [
  { name: "Aircall", logo: "AC" },
  { name: "Spendesk", logo: "SE" },
  { name: "Notion", logo: "NO" },
  { name: "Linear", logo: "LI" },
  { name: "Vercel", logo: "VE" },
  { name: "Stripe", logo: "ST" },
];

export function Testimonials() {
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
    <section id="testimonials" className="py-24 sm:py-32 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Curved Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f9fafb%22%20fill-opacity%3D%220.5%22%3E%3Cpath%20d%3D%22M50%2050c0-27.614-22.386-50-50-50v100c27.614%200%2050-22.386%2050-50z%22/%3E%3Cpath%20d%3D%22M50%2050c0%2027.614%2022.386%2050%2050%2050V0c-27.614%200-50%2022.386-50%2050z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trusted by leading companies
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            See how AI Onboarding Copilot is transforming user experiences across industries.
          </p>
        </motion.div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center rounded-lg bg-gray-50 p-6 transition-all duration-300 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                    {company.logo}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {company.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:ring-gray-700"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Quote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-900 dark:text-white">
                  <p className="text-sm leading-relaxed">"{testimonial.content}"</p>
                </blockquote>

                {/* Author */}
                <div className="mt-6 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-semibold text-white">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">95%</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Faster onboarding
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">45%</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Higher conversion
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">60%</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Fewer support tickets
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
