import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowRight, Check } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, displayName);
        toast.success("Account created successfully!");
      } else {
        await login(email, password);
        toast.success("Welcome back!");
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:flex-1 bg-gradient-hero relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Subtle 3D wave patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute inset-0 bg-black/25" />
        
        {/* Abstract wave patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,300 Q250,200 500,300 T1000,300 L1000,1000 L0,1000 Z" fill="url(#wave1)" />
            <path d="M0,600 Q250,500 500,600 T1000,600 L1000,1000 L0,1000 Z" fill="url(#wave2)" />
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-8 max-w-lg mx-auto lg:mx-0"
          >
            {/* Logo and heading aligned as header */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden bg-white/10 backdrop-blur-sm">
                  <img 
                    src="https://i.ibb.co/ynbPz6cH/logo.png" 
                    alt="MiniTandem Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight">
                  MiniTandem
                </h1>
              </div>
              <p className="text-base lg:text-lg text-white/90 max-w-lg leading-relaxed">
                The intelligent platform that turns trial users into loyal customers with AI-powered guidance and personalized experiences
              </p>
            </div>

            {/* Animated feature bullets */}
            <div className="space-y-5">
              {[
                "95% faster user activation",
                "45% higher trial-to-paid conversion", 
                "AI-powered personalized journeys",
                "Enterprise-grade analytics & insights"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.5, ease: "easeOut" }}
                  className="flex items-center gap-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.15, duration: 0.3, ease: "backOut" }}
                    className="h-7 w-7 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                  >
                    <Check className="h-4 w-4 text-white" />
                  </motion.div>
                  <span className="text-sm lg:text-base text-white/90 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isSignUp ? "Start Your AI-Powered Journey" : "Welcome Back to MiniTandem"}
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              {isSignUp 
                ? "Join 10,000+ companies transforming user onboarding with intelligent guidance"
                : "Log in to access AI-powered onboarding, personalized journeys, and enterprise insights"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <Label htmlFor="displayName" className="text-sm font-medium">
                    What should we call you?
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1 input-enterprise"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Work email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1 input-enterprise focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm focus:shadow-md"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Secure password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="input-enterprise pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm focus:shadow-md"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-border text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-sm p-0 text-indigo-600 hover:text-indigo-700"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  isSignUp ? "Start Free Trial" : "Access Dashboard"
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-background px-4 text-sm font-medium text-gray-500">
                  OR
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="mt-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </motion.div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already part of our community?" : "Ready to transform your onboarding?"}{" "}
                <Button 
                  type="button"
                  variant="link" 
                  className="p-0 text-indigo-600 hover:text-indigo-700 font-semibold"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Sign in here" : "Start your free trial"}
                </Button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}