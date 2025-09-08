import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Lightbulb, Zap, Target, ArrowRight, Navigation, ExternalLink, Link, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiService, AIResponse } from "@/lib/ai";
import { integrationManager } from "@/lib/integrations";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "copilot";
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: "navigate" | "demo" | "info" | "connect" | "data";
    label: string;
    data?: any;
  }>;
}

interface CopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickSuggestions = [
  { icon: Lightbulb, text: "Show me how to add a customer", action: "demo_add_customer" },
  { icon: Zap, text: "Connect a new integration", action: "demo_integration" },
  { icon: Target, text: "Explain the analytics dashboard", action: "demo_analytics" },
];

export function CopilotPanel({ isOpen, onClose }: CopilotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "copilot",
      content: "👋 Hi! I'm your AI Copilot. I can help you navigate, explain features, and guide you through tasks. What would you like to learn?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Set user ID in AI service when user is available
  useEffect(() => {
    if (currentUser) {
      aiService.setUserId(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get real AI response
      const aiResponse: AIResponse = await aiService.generateResponse(content);
      
      const copilotMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "copilot",
        content: aiResponse.content,
        timestamp: new Date(),
        actions: aiResponse.actions,
      };
      
      setMessages(prev => [...prev, copilotMessage]);
    } catch (error) {
      console.error('AI Service Error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "copilot",
        content: "I'm having trouble connecting to the AI service right now. Please try again in a moment, or feel free to explore the platform manually.",
        timestamp: new Date(),
        actions: [
          {
            type: 'navigate',
            label: 'Go to Dashboard',
            data: { path: '/dashboard' }
          }
        ],
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleConnectIntegration = async (integrationId: string) => {
    try {
      toast.loading(`Connecting ${integrationId}...`);
      
      // Test the integration first
      const testResult = await integrationManager.testIntegration(integrationId);
      
      if (testResult) {
        // Connect the integration
        const success = await integrationManager.connectIntegration(integrationId, {
          connectedAt: new Date().toISOString(),
          testPassed: true
        });
        
        if (success) {
          toast.success(`${integrationId} connected successfully!`);
          navigate('/integrations');
        } else {
          toast.error(`Failed to connect ${integrationId}`);
        }
      } else {
        toast.error(`${integrationId} connection test failed. Please check your configuration.`);
      }
    } catch (error) {
      console.error('Error connecting integration:', error);
      toast.error(`Error connecting ${integrationId}`);
    }
  };

  const handleAction = (action: { type: "navigate" | "demo" | "info" | "connect" | "data"; label: string; data?: any }) => {
    switch (action.type) {
      case 'navigate':
        if (action.data?.path) {
          navigate(action.data.path);
          toast.success(`Navigating to ${action.label}`);
        }
        break;
      case 'connect':
        if (action.data?.action === 'connect_integration' && action.data?.integration) {
          // Actually connect the integration
          handleConnectIntegration(action.data.integration);
        } else {
          navigate('/integrations');
          toast.success('Opening integrations page');
        }
        break;
      case 'data':
        navigate('/analytics');
        toast.success('Showing live data insights');
        break;
      case 'demo':
        toast.info(`Demo: ${action.label}`);
        // Handle demo actions here
        break;
      case 'info':
        toast.info(`Info: ${action.label}`);
        // Handle info actions here
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMap: Record<string, string> = {
      demo_add_customer: "Show me how to add a customer",
      demo_integration: "How do I connect a new integration?",
      demo_analytics: "Explain the analytics dashboard",
    };
    
    handleSendMessage(actionMap[action] || action);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 400, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-6 right-6 z-40 w-96 h-[32rem] bg-card border rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-copilot-primary p-4 text-white">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold">AI Copilot</h3>
            <p className="text-xs opacity-90">Here to help you succeed</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 h-80">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] p-3 rounded-xl break-words ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleAction(action)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-xs rounded-full transition-colors cursor-pointer"
                      >
                        {action.type === 'navigate' ? (
                          <Navigation className="h-3 w-3" />
                        ) : action.type === 'connect' ? (
                          <Link className="h-3 w-3" />
                        ) : action.type === 'data' ? (
                          <BarChart3 className="h-3 w-3" />
                        ) : action.type === 'demo' ? (
                          <Zap className="h-3 w-3" />
                        ) : (
                          <ExternalLink className="h-3 w-3" />
                        )}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted p-3 rounded-xl">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground mb-3">Quick suggestions:</p>
          <div className="space-y-2">
            {quickSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickAction(suggestion.action)}
                className="w-full text-left p-2 rounded-lg hover:bg-accent transition-colors text-xs flex items-center gap-2"
              >
                <suggestion.icon className="h-3 w-3 text-primary" />
                {suggestion.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 rounded-xl border-0 bg-muted/50 focus-visible:ring-1"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="rounded-xl bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}