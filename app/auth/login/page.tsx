"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/context/AuthenticationContext";
import { z } from "zod";
import { loginSchema, LoginFormData } from "@/lib/validations"; // Assuming you have this file
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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

  const router = useRouter();
  const { loginUser } = useAuthentication();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
          // Add any other properties required by your Token type
        };

        // Now pass the user and your custom token object
        loginUser(response.data.user, token);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm 
                  ${
                    errors.email
                      ? "border-red-500 text-red-900 placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm 
                  ${
                    errors.password
                      ? "border-red-500 text-red-900 placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {errors.form && (
            <div className="text-red-500 text-sm text-center">
              {errors.form}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
