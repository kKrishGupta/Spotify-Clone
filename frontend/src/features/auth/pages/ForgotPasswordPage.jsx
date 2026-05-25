import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  MailCheck,
} from "lucide-react";

import { toast }
from "sonner";

import { Button }
from "@/components/ui/button";

import { Input }
from "@/components/ui/input";

import { useDocumentTitle }
from "@/hooks/useDocumentTitle";

import { AuthFormCard }
from "@/features/auth/components/AuthFormCard";

import { useAuthForm }
from "@/features/auth/hooks/useAuthForm";

import { useAuthStore }
from "@/features/auth/store/auth.store";

import {
  forgotPasswordSchema,
} from "@/features/auth/validations/auth.schema";

export default function ForgotPasswordPage() {

  useDocumentTitle(
    "Forgot Password",
    "Recover your BeatFlow AI account securely."
  );

  const navigate =
    useNavigate();

  const forgotPassword =
    useAuthStore(
      (state) =>
        state.forgotPassword
    );

  const [loading, setLoading] =
    useState(false);

  const form =
    useAuthForm(
      forgotPasswordSchema,

      {
        email: "",
      }
    );

  const onSubmit =
    form.handleSubmit(
      async (values) => {

        try {

          setLoading(true);

          await forgotPassword({
            email:
              values.email,
          });

          toast.success(
            "Password reset OTP sent"
          );

          navigate(
            "/reset-password",

            {
              state: {
                email:
                  values.email,
              },
            }
          );

        } catch (err) {

          toast.error(

            err?.message ||

            "Failed to send reset OTP"
          );

        } finally {

          setLoading(false);
        }
      }
    );

  return (

    <AuthFormCard

      title="Forgot password"

      description="Enter your email to receive a secure password reset OTP."

      footer={
        <Link
          className="font-semibold text-pulse hover:text-white"
          to="/login"
        >
          Back to login
        </Link>
      }
    >

      <form
        className="space-y-5"
        onSubmit={onSubmit}
      >

        <label className="block space-y-2">

          <span className="text-sm font-medium text-white">
            Email address
          </span>

          <Input
            placeholder="you@example.com"

            {...form.register(
              "email"
            )}
          />

          <span className="text-xs text-red-400">

            {
              form.formState.errors
                .email?.message
            }

          </span>

        </label>

        <Button
          className="h-12 w-full"

          size="lg"

          variant="neon"

          disabled={loading}
        >

          <MailCheck className="size-5" />

          {
            loading
              ? "Sending OTP..."
              : "Send Reset OTP"
          }

        </Button>

      </form>

    </AuthFormCard>
  );
}