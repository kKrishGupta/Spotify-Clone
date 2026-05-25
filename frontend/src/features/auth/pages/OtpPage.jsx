import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ShieldCheck,
  RefreshCcw,
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
  otpSchema,
} from "@/features/auth/validations/auth.schema";

export default function OtpPage() {

  useDocumentTitle(
    "Verify OTP",
    "Verify your BeatFlow AI account."
  );

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const verifyEmail =
    useAuthStore(
      (state) =>
        state.verifyEmail
    );

  const sendOtp =
    useAuthStore(
      (state) =>
        state.sendOtp
    );

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const email =
    location.state?.email || "";

  const form =
    useAuthForm(
      otpSchema,

      {
        otp: "",
      }
    );

  // ✅ VERIFY OTP
  const onSubmit =
    form.handleSubmit(
      async (values) => {

        try {

          setLoading(true);

          await verifyEmail({

            email,

            otp:
              values.otp,
          });

          toast.success(
            "Email verified successfully"
          );

          navigate(
            "/login"
          );

        } catch (err) {

          toast.error(

            err?.response?.data?.message ||

            err?.message ||

            "OTP verification failed"
          );

        } finally {

          setLoading(false);
        }
      }
    );

  // ✅ RESEND OTP
  const handleResendOtp =
    async () => {

      try {

        setResending(true);

        await sendOtp({
          email,
        });

        toast.success(
          "OTP resent successfully"
        );

      } catch (err) {

        toast.error(

          err?.response?.data?.message ||

          err?.message ||

          "Failed to resend OTP"
        );

      } finally {

        setResending(false);
      }
    };

  // ✅ NO EMAIL
  if (!email) {

    return (

      <AuthFormCard
        title="Invalid Session"
        description="Please register again."
      >

        <Button
          className="w-full"
          onClick={() =>
            navigate("/register")
          }
        >
          Back to Register
        </Button>

      </AuthFormCard>
    );
  }

  return (

    <AuthFormCard

      title="Verify your account"

      description="Enter the OTP sent to your email."

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

        {/* EMAIL */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-cyan-300">

          OTP sent to:

          <span className="ml-2 font-semibold text-white">
            {email}
          </span>

        </div>

        {/* OTP */}
        <label className="block space-y-2">

          <span className="text-sm font-medium text-white">
            Verification OTP
          </span>

         <Input
        className="h-14 text-center text-2xl tracking-[0.25em]"

        maxLength={6}

        inputMode="numeric"

        autoComplete="one-time-code"

        placeholder="000000"

        {...form.register(
          "otp",

          {
            setValueAs: (v) =>

              v
                ?.replace(/\s/g, "")
                ?.trim(),
          }
        )}
      />

          <span className="text-xs text-red-400">

            {
              form.formState.errors
                .otp?.message
            }

          </span>

        </label>

        {/* BUTTONS */}
        <div className="flex gap-3">

          <Button
            className="flex-1"
            size="lg"
            variant="neon"

            disabled={loading}
          >

            <ShieldCheck className="size-5" />

            {
              loading
                ? "Verifying..."
                : "Verify OTP"
            }

          </Button>

          <Button
            type="button"

            variant="outline"

            disabled={resending}

            onClick={
              handleResendOtp
            }
          >

            <RefreshCcw className="size-4" />

          </Button>

        </div>

      </form>

    </AuthFormCard>
  );
}