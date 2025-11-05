"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { loginId, password, rememberMe });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" 
      style={{ backgroundColor: "#0F1117" }}
    >
      <Card 
        className="w-full max-w-md shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        style={{ 
          backgroundColor: "#1E2028",
          borderColor: "#2A2D35",
        }}
      >
        <CardHeader className="text-center space-y-2 pb-8 pt-8 px-6">
          <h1 
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            Electrocom
          </h1>
          <p 
            className="text-sm sm:text-base mt-2"
            style={{ color: "#A0A0A0" }}
          >
            Sign in to your account
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="loginId"
                className="text-sm font-medium"
                style={{ color: "#FFFFFF" }}
              >
                Email / Username / Mobile Number
              </Label>
              <Input
                id="loginId"
                type="text"
                placeholder="Enter your email, username, or mobile number"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: "#1A1C23",
                  borderColor: "#2A2D35",
                  color: "#FFFFFF",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#007BFF";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2A2D35";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "#FFFFFF" }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: "#1A1C23",
                  borderColor: "#2A2D35",
                  color: "#FFFFFF",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#007BFF";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2A2D35";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-opacity-50"
                  style={{
                    backgroundColor: rememberMe ? "#007BFF" : "#1A1C23",
                    borderColor: rememberMe ? "#007BFF" : "#2A2D35",
                    accentColor: "#007BFF",
                  }}
                />
                <Label 
                  htmlFor="remember"
                  className="cursor-pointer text-sm"
                  style={{ color: "#A0A0A0" }}
                >
                  Remember Me
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: "#007BFF",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0056CC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007BFF";
              }}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

