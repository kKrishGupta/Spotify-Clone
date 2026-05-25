import { z } from "zod";

// ✅ LOGIN
export const loginSchema =
  z.object({

    email:
      z.string()
        .email(
          "Use a valid email address"
        ),

    password:
      z.string()
        .min(
          8,
          "Password must be at least 8 characters"
        ),
  });

// ✅ REGISTER
export const registerSchema =
  z.object({

    username:
      z.string()
        .min(
          2,
          "Username must be at least 2 characters"
        ),

    email:
      z.string()
        .email(
          "Use a valid email address"
        ),

    otp:
      z.string()
        .optional(),

    password:
      z.string()
        .min(
          8,
          "Password must be at least 8 characters"
        ),

    role: z.enum([
      "user",
      "artist",
      "admin",
    ]),
  });

// ✅ OTP VERIFY
export const otpSchema =
  z.object({

    otp:
      z.string()
        .regex(
          /^\d{6}$/,

          "Enter the 6 digit verification code"
        ),
  });

// ✅ FORGOT PASSWORD
export const forgotPasswordSchema =
  z.object({

    email:
      z.string()
        .email(
          "Use a valid email address"
        ),
  });

// ✅ RESET PASSWORD
export const resetPasswordSchema =
  z.object({

    password:
      z.string()
        .min(
          8,
          "Password must be at least 8 characters"
        ),

    confirmPassword:
      z.string()
        .min(
          8,
          "Confirm the password"
        ),
  })

  .refine(

    (data) =>
      data.password ===
      data.confirmPassword,

    {
      message:
        "Passwords must match",

      path: [
        "confirmPassword",
      ],
    }
  );