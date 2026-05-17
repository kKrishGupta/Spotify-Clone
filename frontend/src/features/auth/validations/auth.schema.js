import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Use a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Use a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6 digit verification code"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Use a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm the password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
