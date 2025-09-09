import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Lightbulb, Zap, Target, ArrowRight, Navigation, ExternalLink, Link, BarChart3, X } from "lucide-react";
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
  { icon: Lightbulb, text: "How to add a customer", action: "demo_add_customer" },
  { icon: Zap, text: "Connect an integration", action: "demo_integration" },
  { icon: Target, text: "Analytics dashboard", action: "demo_analytics" },
];

export function CopilotPanel({ isOpen, onClose }: CopilotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "copilot",
      content: "👋 Hi! I'm your AI Copilot. I can help you navigate the platform, explain features, and guide you through tasks. What would you like to learn?",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
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

  const handleSendSlackMessage = async (message: string) => {
    const loadingToast = toast.loading('Sending message to Slack...');
    try {
      const success = await integrationManager.sendTestMessage('slack', message);
      // Always dismiss the loading toast first
      toast.dismiss(loadingToast);
      
      // Small delay to ensure loading toast is dismissed
      setTimeout(() => {
        if (success) {
          toast.success('Message sent to Slack!');
        } else {
          toast.error('Failed to send message to Slack');
        }
      }, 100);
    } catch (error) {
      console.error('Error sending Slack message:', error);
      toast.dismiss(loadingToast);
      setTimeout(() => {
        toast.error('Error sending message to Slack');
      }, 100);
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
        } else if (action.data?.action === 'send_message' && action.data?.integration === 'slack') {
          // Send Slack message
          handleSendSlackMessage(action.data.message);
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
      className="fixed bottom-6 right-6 z-40 w-96 h-[36rem] bg-card border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-copilot-primary p-4 text-white flex-shrink-0 relative">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">AI Copilot</h3>
            <p className="text-xs opacity-90">Here to help you succeed</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages - Takes up remaining space */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
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
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="p-4 border-t flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Quick suggestions:</p>
          <div className="space-y-2">
            {quickSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleQuickAction(suggestion.action)}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors text-sm flex items-center gap-3"
              >
                <suggestion.icon className="h-4 w-4 text-primary" />
                {suggestion.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t flex-shrink-0 bg-background">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Input field */}
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isTyping}
              className="w-full min-h-[40px] max-h-[120px] px-3 py-2 pr-12 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                height: 'auto',
                overflow: 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            {/* Clear button inside textarea */}
            {inputValue.trim() && (
              <button
                type="button"
                onClick={() => setInputValue("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button 
              type="submit" 
              size="sm"
              disabled={!inputValue.trim() || isTyping}
              className={`h-9 px-4 shadow-md transition-all duration-200 ${
                !inputValue.trim() || isTyping
                  ? 'bg-muted text-muted-foreground border-muted cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary/20 hover:border-primary/40'
              }`}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}