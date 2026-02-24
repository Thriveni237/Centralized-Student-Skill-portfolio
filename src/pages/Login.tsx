"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setDemoMode, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Normalize email before sending
      const normalizedEmail = email.toLowerCase().trim();

      const user = await api.post("/users/login", {
        email: normalizedEmail,
        password,
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      login(user);
      showSuccess("Welcome back to SkillPort!");
      navigate(`/dashboard/${user.role}`);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: "student" | "recruiter" | "admin") => {
    setDemoMode(role);
    showSuccess(`Entering as Demo ${role}...`);
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <Card className="border border-border shadow-xl bg-card text-card-foreground">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary p-2 rounded-xl">
                <GraduationCap className="text-primary-foreground w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-primary font-bold">Presentation Mode</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('student')} className="text-[10px] h-auto py-3 flex-col gap-2 border-border hover:bg-accent">
            <Play className="w-4 h-4 text-primary" /> Student
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('recruiter')} className="text-[10px] h-auto py-3 flex-col gap-2 border-border hover:bg-accent">
            <Play className="w-4 h-4 text-primary" /> Recruiter
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoLogin('admin')} className="text-[10px] h-auto py-3 flex-col gap-2 border-border hover:bg-accent">
            <Play className="w-4 h-4 text-primary" /> Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;