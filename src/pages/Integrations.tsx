import { useState, useEffect } from "react";
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
  TestTube,
  AlertCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { integrationManager, IntegrationConfig } from "@/lib/integrations";
import { IntegrationService, Integration } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [availableIntegrations, setAvailableIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<Set<string>>(new Set());
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      integrationManager.setUserId(currentUser.uid);
      loadIntegrations();
    }
  }, [currentUser]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const [userIntegrations, available] = await Promise.all([
        IntegrationService.getIntegrations(currentUser!.uid),
        integrationManager.getAvailableIntegrations()
      ]);
      setIntegrations(userIntegrations);
      setAvailableIntegrations(available);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "All", count: availableIntegrations.length },
    { id: "communication", label: "Communication", count: availableIntegrations.filter((i) => i.type === "communication").length },
    { id: "storage", label: "Storage", count: availableIntegrations.filter((i) => i.type === "storage").length },
    { id: "productivity", label: "Productivity", count: availableIntegrations.filter((i) => i.type === "productivity").length },
    { id: "analytics", label: "Analytics", count: availableIntegrations.filter((i) => i.type === "analytics").length },
  ];

  const filteredIntegrations = availableIntegrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIntegrationStatus = (integrationId: string): 'connected' | 'disconnected' | 'error' => {
    const integration = integrations.find(i => i.name.toLowerCase() === integrationId.toLowerCase());
    return integration?.status || 'disconnected';
  };

  const handleConnectIntegration = async (integrationId: string) => {
    try {
      toast.loading(`Connecting ${integrationId}...`);
      
      // Generate OAuth URL
      const oauthUrl = integrationManager.generateOAuthUrl(integrationId);
      if (oauthUrl) {
        // Open OAuth flow in popup
        const popup = window.open(oauthUrl, 'oauth', 'width=600,height=700');
        
        // Listen for popup completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            loadIntegrations(); // Reload integrations
            toast.dismiss();
            toast.success(`${integrationId} connection completed`);
          }
        }, 1000);
      } else {
        // No OAuth URL available - client ID not configured
        toast.error(`${integrationId} integration not configured. Please add the client ID to environment variables.`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(`Failed to connect ${integrationId}`);
    }
  };

  const handleDisconnectIntegration = async (integrationId: string) => {
    try {
      toast.loading(`Disconnecting ${integrationId}...`);
      const success = await integrationManager.disconnectIntegration(integrationId);
      if (success) {
        toast.success(`${integrationId} disconnected successfully!`);
        loadIntegrations();
      } else {
        toast.error(`Failed to disconnect ${integrationId}`);
      }
    } catch (error) {
      console.error('Disconnection error:', error);
      toast.error(`Failed to disconnect ${integrationId}`);
    }
  };

  const handleTestIntegration = async (integrationId: string) => {
    try {
      setTesting(prev => new Set(prev).add(integrationId));
      toast.loading(`Testing ${integrationId}...`);
      
      const success = await integrationManager.testIntegration(integrationId);
      if (success) {
        toast.success(`${integrationId} test passed!`);
      } else {
        toast.error(`${integrationId} test failed`);
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error(`${integrationId} test failed`);
    } finally {
      setTesting(prev => {
        const newSet = new Set(prev);
        newSet.delete(integrationId);
        return newSet;
      });
    }
  };

  const handleSendTestMessage = async (integrationId: string) => {
    try {
      toast.loading(`Sending test message to ${integrationId}...`);
      const success = await integrationManager.sendTestMessage(integrationId, "Hello from MiniTandem! This is a test message.");
      if (success) {
        toast.success(`Test message sent to ${integrationId}!`);
      } else {
        toast.error(`Failed to send test message to ${integrationId}`);
      }
    } catch (error) {
      console.error('Test message error:', error);
      toast.error(`Failed to send test message to ${integrationId}`);
    }
  };

  const getStatusBadge = (status: 'connected' | 'disconnected' | 'error') => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Error</Badge>;
      default:
        return <Badge variant="secondary">Not Connected</Badge>;
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'communication':
        return '💬';
      case 'storage':
        return '📁';
      case 'productivity':
        return '⚡';
      case 'analytics':
        return '📊';
      default:
        return '🔗';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading integrations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect your favorite tools to streamline your workflow
          </p>
        </div>
        <Button onClick={loadIntegrations} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plug className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Available</p>
                <p className="text-2xl font-bold">{availableIntegrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Connected</p>
                <p className="text-2xl font-bold">{integrations.filter(i => i.status === 'connected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Errors</p>
                <p className="text-2xl font-bold">{integrations.filter(i => i.status === 'error').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">{integrations.filter(i => i.status === 'connected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const status = getIntegrationStatus(integration.name.toLowerCase());
          const isConnected = status === 'connected';
          const isTesting = testing.has(integration.name.toLowerCase());

          return (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {getCategoryIcon(integration.type)}
                          </span>
                          <span className="text-sm text-muted-foreground capitalize">
                            {integration.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {integration.setupUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(integration.setupUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Setup Guide
                      </Button>
                    )}
                    
                    {isConnected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestIntegration(integration.name.toLowerCase())}
                          disabled={isTesting}
                        >
                          {isTesting ? (
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <TestTube className="h-3 w-3 mr-1" />
                          )}
                          Test
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendTestMessage(integration.name.toLowerCase())}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Send Test
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnectIntegration(integration.name.toLowerCase())}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleConnectIntegration(integration.name.toLowerCase())}
                        className="w-full"
                      >
                        <Plug className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Plug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}