import { motion } from "framer-motion";
import { 
  UserPlus, 
  Brain, 
  CheckCircle,
  ArrowRight 
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "User Prompts",
    description: "New users sign up and provide basic information about their goals and use case.",
    details: [
      "Quick onboarding survey",
      "Goal setting and preferences",
      "Integration with existing tools"
    ],
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Guides",
    description: "Our AI analyzes user behavior and provides personalized guidance and recommendations.",
    details: [
      "Intelligent step-by-step guidance",
      "Contextual help and tooltips",
      "Adaptive learning paths"
    ],
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Task Completed",
    description: "Users successfully complete their onboarding and achieve their first value moment.",
    details: [
      "Success metrics tracking",
      "Automated follow-up sequences",
      "Conversion to paid plans"
    ],
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
];

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="how-it-works" className="py-24 sm:py-32 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
      {/* Curved Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e5e7eb%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%222%22/%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%221.5%22/%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2260%22%20r%3D%221.5%22/%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2260%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2220%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-50/20 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Three simple steps to transform your user onboarding experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-16 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-gray-300 to-gray-200 lg:block dark:from-gray-600 dark:to-gray-700" />
                )}

                <div className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:ring-gray-700">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r ${step.color} text-sm font-bold text-white`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${step.bgColor} mb-6`}>
                    <step.icon className={`h-8 w-8 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>

                    {/* Details List */}
                    <ul className="mt-6 space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center rounded-full bg-white px-6 py-3 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Ready to get started?
            </span>
            <button className="ml-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Try it now
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
