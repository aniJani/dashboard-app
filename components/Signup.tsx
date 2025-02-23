"use client";

import { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { DonutChart } from "@/components/ui/donut-chart";
import { ElevationChart } from "@/components/ui/elevation-chart";

interface SignupProps {
  onModeSwitch: () => void;
}

const Signup: React.FC<SignupProps> = ({ onModeSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userID", result.user.uid);
    } catch (err: any) {
      console.error("Error signing up:", err);
      setError(
        err.code === "auth/email-already-in-use"
          ? "Email already in use"
          : "An error occurred during signup"
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

        {/* Signup Form */}
        <div className="w-full min-h-screen bg-accent/5 backdrop-blur-sm relative z-10">
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
                  <h1 className="font-space-grotesk text-3xl font-bold mb-8 bg-gradient-to-r from-[#00caeb] to-[#df3f8b] bg-clip-text text-transparent">
                    Create Account
                  </h1>

                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">Email</Label>
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
                      <Label htmlFor="password" className="text-base">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 text-base md:text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-base">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Button 
                          variant="link" 
                          className="px-0 h-auto"
                          onClick={onModeSwitch}
                        >
                          Log in <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </p>
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

export default Signup;
