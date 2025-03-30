"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { useAuthentication } from "@/context/AuthenticationContext";
import Link from "next/link";
import { Token, User } from "@/context/auth.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    displayName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { loginUser } = useAuthentication();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using Zod schema
    try {
      // Validate the entire form data
      registerSchema.parse(formData);

      // Reset any previous errors
      setErrors({});
      setIsLoading(true);

      const response = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { displayName: formData.displayName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // Convert the Supabase user to your custom type with proper type safety
      if (response.data.session && response.data.user) {
        const supabaseUser = response.data.user;

        const customUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: supabaseUser.role || "user",
          displayName: supabaseUser.user_metadata?.displayName || "",
          created_at: "",
          updated_at: "",
          user_metadata: {
            displayName: undefined,
            email: undefined,
            email_verified: undefined,
            phone_verified: undefined,
            sub: undefined,
          },
        };

        const session: Token = {
          accessToken: response.data.session.access_token,
          expiresAt:
            response.data.session.expires_at ||
            Math.floor(Date.now() / 1000) + 3600,
        };

        loginUser(customUser, session);
        router.push("/");
      } else if (response.error) {
        setError(response.error?.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }

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
        setErrors({
          form:
            err.message === "auth/email-already-in-use"
              ? "Email is already registered"
              : err.message,
        });
      }
      // Catch-all for unexpected errors
      else {
        setErrors({
          form: "An unexpected error occurred during registration",
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
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <div className="space-y-2">
              {/* Display Name */}
              <div className="space-y-1">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  placeholder="John Doe"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={errors.displayName ? "border-red-500" : ""}
                />
                {errors.displayName && (
                  <p className="text-xs text-red-500">{errors.displayName}</p>
                )}
              </div>

              {/* Email */}
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

              {/* Password */}
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

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="underline text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
