import { motion } from "framer-motion";
import { 
  Brain, 
  Zap, 
  Users, 
  BarChart3, 
  Shield,
  ArrowRight 
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Guidance",
    description: "Intelligent recommendations that adapt to each user's behavior and preferences, guiding them to success faster.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description: "Streamline complex onboarding processes with smart automation that reduces manual work by 80%.",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: Users,
    title: "Personalized Experiences",
    description: "Create tailored onboarding journeys that resonate with different user segments and use cases.",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track user progress, identify bottlenecks, and optimize conversion rates with detailed insights.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with SOC 2 compliance, SSO integration, and data encryption at rest.",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
];

export function Features() {
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
    <section id="features" className="py-24 sm:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Curved Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3f4f6%22%20fill-opacity%3D%220.3%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to onboard users successfully
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Powerful features designed to reduce churn, increase activation, and accelerate time-to-value.
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
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-lg hover:ring-gray-300 dark:bg-gray-800 dark:ring-gray-700 dark:hover:ring-gray-600"
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-white/10" />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
