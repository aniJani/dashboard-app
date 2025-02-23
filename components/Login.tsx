// components/Login.tsx
"use client";

import type { User } from "@/lib/firebase";
import { auth, signInWithEmailAndPassword } from "@/lib/firebase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  LineChart,
  BarChart,
  PieChart,
  ArrowRight,
} from "lucide-react";
import { DonutChart } from "@/components/ui/donut-chart";
import { ElevationChart } from "@/components/ui/elevation-chart";

interface LoginProps {
  onModeSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onModeSwitch }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userID", result.user.uid);
    } catch (err: any) {
      console.error("Error signing in:", err);
      setError(
        err.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-background text-foreground overflow-hidden">
      <div className="flex min-h-screen flex-col lg:flex-row relative">
        {/* Background Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Top Left - Donut Chart */}
            <div className="absolute -top-[25%] -left-[25%] w-[100%] h-[100%] opacity-[0.25]">
              <DonutChart />
            </div>
            
           
            {/* Bottom Right - Elevation Chart */}
            <div className="absolute bottom-0 right-0 w-[70%] h-[90%] opacity-[0.25]">
              <ElevationChart />
            </div>

            {/* Additional decorative elements */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#00caeb] rounded-full animate-ping opacity-25" />
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#df3f8b] rounded-full animate-ping delay-300 opacity-25" />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#060885] rounded-full animate-ping delay-700 opacity-25" />
          </motion.div>
        </div>

        {/* Left Side - Hero Content */}
        <div className="w-full lg:w-3/5 p-6 lg:p-12 xl:p-16 flex items-center justify-center order-2 lg:order-1 relative z-10">
          <div className="w-full relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="space-y-12 lg:space-y-16">
                {/* Header Title */}
                <h1 className="font-space-grotesk text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                  <motion.span 
                    className="block bg-gradient-to-r from-[#00caeb] to-[#df3f8b] bg-clip-text text-transparent"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Data
                  </motion.span>
                  <motion.span 
                    className="block bg-gradient-to-r from-[#df3f8b] to-[#060885] bg-clip-text text-transparent"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Visualization
                  </motion.span>
                  <motion.span 
                    className="block bg-gradient-to-r from-[#060885] to-[#00caeb] bg-clip-text text-transparent"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Studio
                  </motion.span>
                </h1>

                {/* Mission Statement */}
                <div className="space-y-6">
                  <motion.p 
                    className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-light max-w-2xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Our Mission
                  </motion.p>
                  <motion.p 
                    className="text-lg sm:text-xl text-muted-foreground/80 max-w-2xl leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Transform complex data into compelling visual narratives. 
                    We empower organizations to uncover insights, make informed decisions, 
                    and communicate their data story effectively.
                  </motion.p>
                </div>

                {/* Chart Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-lg bg-accent/5 relative overflow-hidden group"
                  >
                    {/* Neon border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00caeb] via-[#00caeb] to-[#00caeb] opacity-50 blur group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute inset-[1px] rounded-lg bg-background"></div>
                    
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <LineChart className="w-full h-full stroke-[#00caeb]" strokeWidth={0.5} />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <LineChart className="h-8 w-8 text-[#00caeb]" />
                      <h3 className="font-semibold text-lg text-[#00caeb]">Time Series Analysis</h3>
                      <p className="text-sm text-foreground/80">Track trends and patterns over time with interactive line charts</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-lg bg-accent/5 relative overflow-hidden group"
                  >
                    {/* Neon border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#df3f8b] via-[#df3f8b] to-[#df3f8b] opacity-50 blur group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute inset-[1px] rounded-lg bg-background"></div>
                    
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <BarChart className="w-full h-full stroke-[#df3f8b]" strokeWidth={0.5} />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <BarChart className="h-8 w-8 text-[#df3f8b]" />
                      <h3 className="font-semibold text-lg text-[#df3f8b]">Comparative Analysis</h3>
                      <p className="text-sm text-foreground/80">Compare categories and distributions with dynamic bar charts</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-lg bg-accent/5 relative overflow-hidden group"
                  >
                    {/* Neon border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#060885] via-[#060885] to-[#060885] opacity-50 blur group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute inset-[1px] rounded-lg bg-background"></div>
                    
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <PieChart className="w-full h-full stroke-[#060885]" strokeWidth={0.5} />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <PieChart className="h-8 w-8 text-[#060885]" />
                      <h3 className="font-semibold text-lg text-[#060885]">Part-to-Whole Analysis</h3>
                      <p className="text-sm text-foreground/80">Understand composition and proportions with pie charts</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-2/5 min-h-[50vh] lg:min-h-screen bg-accent/5 backdrop-blur-sm order-1 lg:order-2 relative z-10">
          <div className="h-full w-full flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md relative"
            >
              {/* Neon glow effects */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00caeb] via-[#df3f8b] to-[#060885] rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt-slow"></div>

              <Card className="relative border border-accent/20 bg-black/90 shadow-lg backdrop-blur-sm">
                <CardContent className="p-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 text-base md:text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-base">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 text-base md:text-sm"
                      />
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Get Started"
                      )}
                    </Button>

                    <div className="space-y-3 text-center">
                      <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Button 
                          variant="link" 
                          className="px-0 h-auto"
                          onClick={onModeSwitch}
                        >
                          Sign up <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </p>
                      <Button
                        variant="link"
                        className="text-sm text-muted-foreground hover:text-primary"
                        type="button"
                      >
                        Forgot your password?
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
