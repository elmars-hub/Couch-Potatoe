"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { registerSchema, RegisterFormData } from "@/lib/validations"; // Assuming you have this file
import { useAuthentication } from "@/context/AuthenticationContext";

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
          data: { displayName: formData.displayName }, // Save display name in user metadata
          emailRedirectTo: `${window.location.origin}/auth/callback`, // Add redirect URL for email verification
        },
      });

      if (response.data.session) {
        loginUser(response.data.user, response.data.session);

        router.push("/"); // More specific redirect
      } else if (response.error) {
        setError(response.error?.message);
      }
    } catch (err) {
      setError(err?.message);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
        </div>
        <form onSubmit={handleRegister} className="mt-8 space-y-6" noValidate>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Display Name Input */}
            <div>
              <label htmlFor="displayName" className="sr-only">
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                className={`appearance-none relative block w-full px-3 py-2 border rounded-t-md focus:outline-none sm:text-sm 
                  ${
                    errors.displayName
                      ? "border-red-500 text-red-900 placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                placeholder="Display Name"
                value={formData.displayName}
                onChange={handleInputChange}
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.displayName}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`appearance-none relative block w-full px-3 py-2 border focus:outline-none sm:text-sm 
                  ${
                    errors.email
                      ? "border-red-500 text-red-900 placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className={`appearance-none relative block w-full px-3 py-2 border rounded-b-md focus:outline-none sm:text-sm 
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

          {/* Form-level Error */}
          {errors.form && (
            <div className="text-red-500 text-sm text-center">
              {errors.form}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
