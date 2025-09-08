import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plug,
  Check,
  X,
  Settings,
  ExternalLink,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "productivity" | "communication" | "storage" | "analytics";
  connected: boolean;
  featured: boolean;
  setupTime: string;
}

const integrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and updates to your team channels",
    icon: "💬",
    category: "communication",
    connected: true,
    featured: true,
    setupTime: "2 min",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Store and sync files with your Google Drive account",
    icon: "📁",
    category: "storage",
    connected: true,
    featured: true,
    setupTime: "1 min",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Create and update pages in your Notion workspace",
    icon: "📝",
    category: "productivity",
    connected: false,
    featured: true,
    setupTime: "3 min",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5000+ apps through automation workflows",
    icon: "⚡",
    category: "productivity",
    connected: false,
    featured: false,
    setupTime: "5 min",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Send messages to Discord servers and channels",
    icon: "🎮",
    category: "communication",
    connected: false,
    featured: false,
    setupTime: "2 min",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track user behavior and onboarding funnel metrics",
    icon: "📊",
    category: "analytics",
    connected: true,
    featured: false,
    setupTime: "4 min",
  },
];

const categories = [
  { id: "all", label: "All", icon: Plug },
  { id: "productivity", label: "Productivity", icon: Zap },
  { id: "communication", label: "Communication", icon: Settings },
  { id: "storage", label: "Storage", icon: Shield },
  { id: "analytics", label: "Analytics", icon: RefreshCw },
];

export default function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredIntegrations, setFilteredIntegrations] = useState(integrations);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredIntegrations(integrations);
    } else {
      setFilteredIntegrations(
        integrations.filter((integration) => integration.category === category)
      );
    }
  };

  const toggleConnection = (id: string) => {
    setFilteredIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const connectedCount = integrations.filter((i) => i.connected).length;

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
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect your favorite tools and automate workflows
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{connectedCount}</p>
            <p className="text-sm text-muted-foreground">Connected</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-enterprise">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Plug className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrations.length}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-enterprise">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Check className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{connectedCount}</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-enterprise">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-sm text-muted-foreground">Last Sync</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Category Filter */}
      <Card className="card-enterprise">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.id)}
                className="gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Integrations */}
      {selectedCategory === "all" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Featured Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations
                .filter((integration) => integration.featured)
                .map((integration, index) => (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="card-interactive h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{integration.icon}</div>
                            <div>
                              <h3 className="font-semibold">{integration.name}</h3>
                              <Badge variant="outline" className="text-xs mt-1">
                                {integration.setupTime} setup
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {integration.connected ? (
                              <Check className="h-5 w-5 text-success" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground" />
                            )}
                            <Switch
                              checked={integration.connected}
                              onCheckedChange={() => toggleConnection(integration.id)}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {integration.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {integration.category}
                          </Badge>
                          {integration.connected ? (
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                          ) : (
                            <Button size="sm" className="btn-primary">
                              Connect
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* All Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {selectedCategory === "all" ? "All Integrations" : `${categories.find(c => c.id === selectedCategory)?.label} Integrations`}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {filteredIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="card-enterprise">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{integration.icon}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{integration.name}</h3>
                            {integration.featured && (
                              <Badge className="bg-primary/10 text-primary text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {integration.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {integration.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {integration.setupTime} setup
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {integration.connected ? (
                            <div className="flex items-center gap-2 text-success">
                              <Check className="h-4 w-4" />
                              <span className="text-sm font-medium">Connected</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Not connected
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {integration.connected && (
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Switch
                            checked={integration.connected}
                            onCheckedChange={() => toggleConnection(integration.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}