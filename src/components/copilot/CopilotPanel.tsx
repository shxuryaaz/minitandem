import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Lightbulb, Zap, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  type: "user" | "copilot";
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: "highlight" | "click" | "fill";
    element: string;
    value?: string;
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
      content: "👋 Hi! I'm your AI Onboarding Copilot. I can help you navigate the platform, explain features, and guide you through common tasks. What would you like to learn?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    // Simulate AI response
    setTimeout(() => {
      const copilotMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "copilot",
        content: generateCopilotResponse(content),
        timestamp: new Date(),
        actions: generateActions(content),
      };
      
      setMessages(prev => [...prev, copilotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateCopilotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("customer") || input.includes("add")) {
      return "I'll help you add a new customer! Let me highlight the 'Add Customer' button and walk you through the process. You'll need to provide the customer's name, email, and company information.";
    }
    
    if (input.includes("integration")) {
      return "Great! I'll show you how to connect integrations. The Integrations page displays all available services like Google Drive, Slack, and Notion. I can guide you through connecting any of these.";
    }
    
    if (input.includes("analytics") || input.includes("dashboard")) {
      return "The Analytics dashboard shows key metrics about user engagement and feature usage. I'll highlight the important sections and explain what each metric means for your business.";
    }
    
    return "I understand you're looking for help with that feature. Let me guide you through the relevant sections of the platform and explain how everything works together.";
  };

  const generateActions = (userInput: string): Message["actions"] => {
    const input = userInput.toLowerCase();
    
    if (input.includes("customer")) {
      return [
        { type: "highlight", element: "add-customer-button" },
        { type: "click", element: "customers-nav" },
      ];
    }
    
    return [];
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
                className={`max-w-[80%] p-3 rounded-xl ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.actions.map((action, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-xs rounded-full"
                      >
                        <ArrowRight className="h-3 w-3" />
                        {action.type}
                      </span>
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