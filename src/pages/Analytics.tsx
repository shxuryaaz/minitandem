import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const metrics = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Onboarding Rate",
    value: "87.2%",
    change: "+5.1%",
    trend: "up",
    icon: Target,
  },
  {
    title: "Avg. Time to Complete",
    value: "4.2 min",
    change: "-1.3 min",
    trend: "up",
    icon: Clock,
  },
  {
    title: "Feature Adoption",
    value: "94.8%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
  },
];

const topIntents = [
  {
    intent: "How to add customers",
    frequency: 847,
    change: "+15%",
    category: "Customer Management",
  },
  {
    intent: "Connect integrations",
    frequency: 623,
    change: "+8%",
    category: "Integrations",
  },
  {
    intent: "View analytics dashboard",
    frequency: 456,
    change: "+23%",
    category: "Analytics",
  },
  {
    intent: "Update profile settings",
    frequency: 389,
    change: "-5%",
    category: "Settings",
  },
  {
    intent: "Export customer data",
    frequency: 234,
    change: "+12%",
    category: "Data Management",
  },
];

const onboardingSteps = [
  { step: "Account Creation", completion: 98, dropOff: 2 },
  { step: "Profile Setup", completion: 87, dropOff: 11 },
  { step: "First Integration", completion: 74, dropOff: 15 },
  { step: "Invite Team", completion: 62, dropOff: 16 },
  { step: "Complete Tutorial", completion: 54, dropOff: 13 },
];

const recentSessions = [
  {
    user: "Sarah Johnson",
    duration: "12 min",
    actions: 23,
    completed: true,
    timestamp: "2 hours ago",
  },
  {
    user: "Mike Chen",
    duration: "8 min",
    actions: 15,
    completed: true,
    timestamp: "3 hours ago",
  },
  {
    user: "Emily Davis",
    duration: "15 min",
    actions: 31,
    completed: false,
    timestamp: "5 hours ago",
  },
  {
    user: "Alex Turner",
    duration: "6 min",
    actions: 12,
    completed: true,
    timestamp: "1 day ago",
  },
];

export default function Analytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track onboarding performance and user behavior insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="btn-primary gap-2">
            <Calendar className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="card-enterprise">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {metric.value}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      metric.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {metric.change}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Onboarding Funnel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-enterprise">
            <CardHeader>
              <CardTitle>Onboarding Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {onboardingSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{step.step}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {step.completion}%
                        </span>
                        <span className="text-xs text-destructive">
                          -{step.dropOff}% drop-off
                        </span>
                      </div>
                    </div>
                    <Progress value={step.completion} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top User Intents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-enterprise">
            <CardHeader>
              <CardTitle>Top User Intents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topIntents.map((intent, index) => (
                  <motion.div
                    key={intent.intent}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{intent.intent}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {intent.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {intent.frequency} requests
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        intent.change.startsWith("+")
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {intent.change}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="card-enterprise">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Onboarding Sessions</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <motion.div
                  key={session.user}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                      {session.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium">{session.user}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.duration} • {session.actions} actions • {session.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.completed ? (
                      <Badge className="bg-success/10 text-success border-success/20">
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-warning/20 text-warning">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}