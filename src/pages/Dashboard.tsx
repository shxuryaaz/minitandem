import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CustomerService, AnalyticsService } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Helper function to get time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
};

// This will be replaced with real data

// Quick actions will be defined in the component with proper handlers

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    {
      title: "Total Customers",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Users,
    },
    {
      title: "New This Month",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Engagement Rate",
      value: "0%",
      change: "+0%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Active Users",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: DollarSign,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  // Quick actions with handlers
  const quickActions = [
    { 
      title: "Add Customer", 
      description: "Invite new users to platform",
      onClick: () => navigate('/customers')
    },
    { 
      title: "Setup Integration", 
      description: "Connect external services",
      onClick: () => navigate('/integrations')
    },
    { 
      title: "View Analytics", 
      description: "Check performance metrics",
      onClick: () => navigate('/analytics')
    },
    { 
      title: "Manage Settings", 
      description: "Configure platform options",
      onClick: () => navigate('/settings')
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch customers
        const customers = await CustomerService.getCustomers();
        const totalCustomers = customers.length;
        
        // Calculate new customers this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newThisMonth = customers.filter(customer => {
          const customerDate = new Date(customer.createdAt);
          return customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear;
        }).length;
        
        // Fetch analytics
        const analytics = await AnalyticsService.getTodayAnalytics();
        const engagementRate = analytics ? analytics.metrics.engagementRate : 0;
        const activeUsers = analytics ? analytics.metrics.activeUsers : 0;
        
        // Update stats with real data
        setStats([
          {
            title: "Total Customers",
            value: totalCustomers.toLocaleString(),
            change: "+0%", // TODO: Calculate actual change
            trend: "up",
            icon: Users,
          },
          {
            title: "New This Month",
            value: newThisMonth.toLocaleString(),
            change: "+0%", // TODO: Calculate actual change
            trend: "up",
            icon: Activity,
          },
          {
            title: "Engagement Rate",
            value: `${engagementRate.toFixed(1)}%`,
            change: "+0%", // TODO: Calculate actual change
            trend: "up",
            icon: TrendingUp,
          },
          {
            title: "Active Users",
            value: activeUsers.toLocaleString(),
            change: "+0%", // TODO: Calculate actual change
            trend: "up",
            icon: DollarSign,
          },
        ]);

        // Update recent activity with real customer data
        const recentCustomers = customers.slice(0, 4).map(customer => {
          const timeAgo = getTimeAgo(new Date(customer.createdAt));
          return {
            user: customer.name,
            action: `joined as ${customer.status} customer`,
            time: timeAgo,
            avatar: customer.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          };
        });
        setRecentActivity(recentCustomers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <Button className="btn-primary">
            View Reports
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Card className="card-enterprise">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-success mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="card-enterprise">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="card-enterprise">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={action.onClick}
                    className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-sm">{action.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Onboarding Completion</span>
                  <span className="font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>User Engagement</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Feature Adoption</span>
                  <span className="font-medium">74%</span>
                </div>
                <Progress value={74} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}