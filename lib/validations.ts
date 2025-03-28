import { z } from "zod";

// Common validation messages
const messages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  password: {
    min: "Password must be at least 8 characters",
    uppercase: "Password must contain at least one uppercase letter",
    lowercase: "Password must contain at least one lowercase letter",
    number: "Password must contain at least one number",
    special: "Password must contain at least one special character",
  },
  displayName: {
    min: "Name must be at least 2 characters",
    max: "Name cannot exceed 50 characters",
  },
};

// Base email schema
const emailSchema = z
  .string()
  .min(1, messages.required)
  .email(messages.email);

// Base password schema
const passwordSchema = z
  .string()
  .min(1, messages.required)
  .min(8, messages.password.min)
  .regex(/[A-Z]/, messages.password.uppercase)
  .regex(/[a-z]/, messages.password.lowercase)
  .regex(/[0-9]/, messages.password.number)
  .regex(/[!@#$%^&*(),.?":{}|<>]/, messages.password.special);

// Display name schema
const displayNameSchema = z
  .string()
  .min(1, messages.required)
  .min(2, messages.displayName.min)
  .max(50, messages.displayName.max);

// Registration form schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
});

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, messages.required),
});

// Types derived from schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>; 