"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ChefHat } from "lucide-react";

export default function SignUpView({ onSignUp, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (email && password) {
    onSignUp(email, password);
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <ChefHat className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Sign Up</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-muted-foreground bg-white px-2">Or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" size="lg">
            Continue with Google
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button className="font-medium text-green-600 hover:underline">
              Sign In
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
