"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/context/AuthenticationContext";
import { z } from "zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User } from "@/context/auth.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const { loginUser } = useAuthentication();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setFormData((prev: LoginFormData) => ({
        ...prev,
        [name]: value,
      }));

      // Clear specific field error when user starts typing
      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using Zod schema
    try {
      // Validate the entire form data
      loginSchema.parse(formData);

      // Reset any previous errors
      setErrors({});
      setError("");
      setIsLoading(true);

      const response = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.session) {
        // Create a Token object from the Supabase session
        const token = {
          accessToken: response.data.session.access_token,
          expiresAt:
            response.data.session.expires_at ??
            Math.floor(Date.now() / 1000) + 3600, // Default to 1 hour from now if undefined
        };

        // Now pass the user and your custom token object
        loginUser(response.data.user as User, token);

        router.push("/"); // More specific redirect
      } else if (response.error) {
        setError(response.error?.message);
      }
    } catch (err) {
      console.log("error", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      // Handle Zod validation errors
      if (err instanceof z.ZodError) {
        const fieldErrors: typeof errors = {};

        err.errors.forEach((error) => {
          const path = error.path[0] as keyof typeof errors;
          fieldErrors[path] = error.message;
        });

        setErrors(fieldErrors);
      }
      // Handle Supabase or network errors
      else if (err instanceof Error) {
        const errorMessage = err.message;
        setErrors({
          form:
            errorMessage === "auth/invalid-credential"
              ? "Invalid email or password"
              : errorMessage === "auth/user-not-found"
              ? "No account found with this email"
              : errorMessage === "auth/wrong-password"
              ? "Incorrect password"
              : "Login failed. Please try again",
        });
      }
      // Catch-all for unexpected errors
      else {
        setErrors({
          form: "An unexpected error occurred during login",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh] w-full flex  justify-center px-6">
      <Card className="w-full max-w-md shadow-lg h-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              {/* Email Input */}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            {errors.form && (
              <Alert variant="destructive">
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember-me" className="text-sm">
                  Remember me
                </Label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="underline text-primary hover:text-primary/80"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
