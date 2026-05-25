import { useState }
from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  KeyRound,
  ShieldCheck,
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
  resetPasswordSchema,
} from "@/features/auth/validations/auth.schema";

export default function ResetPasswordPage() {

  useDocumentTitle(
    "Reset Password",
    "Reset your BeatFlow AI password securely."
  );

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const email =
    location.state?.email || "";

  const verifyResetOtp =
    useAuthStore(
      (state) =>
        state.verifyResetOtp
    );

  const resetPassword =
    useAuthStore(
      (state) =>
        state.resetPassword
    );

  const [otpVerified, setOtpVerified] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [otp, setOtp] =
    useState("");

  const form =
    useAuthForm(
      resetPasswordSchema,

      {
        password: "",
        confirmPassword: "",
      }
    );

  // ✅ VERIFY RESET OTP
  const handleVerifyOtp =
    async () => {

      try {

        setLoading(true);

        await verifyResetOtp({

          email,

          otp,
        });

        setOtpVerified(true);

        toast.success(
          "OTP verified successfully"
        );

      } catch (err) {

        toast.error(

          err?.message ||

          "Invalid OTP"
        );

      } finally {

        setLoading(false);
      }
    };

  // ✅ RESET PASSWORD
  const onSubmit =
    form.handleSubmit(
      async (values) => {

        try {

          setLoading(true);

          await resetPassword({

            email,

            password:
              values.password,
          });

          toast.success(
            "Password reset successful"
          );

          navigate(
            "/login"
          );

        } catch (err) {

          toast.error(

            err?.message ||

            "Password reset failed"
          );

        } finally {

          setLoading(false);
        }
      }
    );

  // ✅ INVALID ACCESS
  if (!email) {

    return (

      <AuthFormCard
        title="Invalid session"
        description="Please restart password recovery."
      >

        <Button
          className="w-full"

          onClick={() =>
            navigate(
              "/forgot-password"
            )
          }
        >
          Go back
        </Button>

      </AuthFormCard>
    );
  }

  return (

    <AuthFormCard

      title="Reset password"

      description="Verify OTP and create a new password."

      footer={
        <Link
          className="font-semibold text-pulse hover:text-white"
          to="/login"
        >
          Back to login
        </Link>
      }
    >

      {/* EMAIL */}
      <div className="mb-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-cyan-300">

        Reset OTP sent to:

        <span className="ml-2 font-semibold text-white">
          {email}
        </span>

      </div>

      {/* OTP SECTION */}
      {!otpVerified ? (

        <div className="space-y-5">

          <label className="block space-y-2">

            <span className="text-sm font-medium text-white">
              Enter OTP
            </span>

            <Input
              className="h-14 text-center text-2xl tracking-[0.25em]"

              maxLength={6}

              inputMode="numeric"

              autoComplete="one-time-code"

              value={otp}

              onChange={(e) =>
                setOtp(
                  e.target.value.replace(
                    /\s/g,
                    ""
                  )
                )
              }
            />

          </label>

          <Button
            className="h-12 w-full"

            variant="neon"

            disabled={loading}

            onClick={
              handleVerifyOtp
            }
          >

            <ShieldCheck className="size-5" />

            {
              loading
                ? "Verifying..."
                : "Verify OTP"
            }

          </Button>

        </div>

      ) : (

        // ✅ PASSWORD RESET FORM
        <form
          className="space-y-5"
          onSubmit={onSubmit}
        >

          <label className="block space-y-2">

            <span className="text-sm font-medium text-white">
              New password
            </span>

            <Input
              type="password"

              {...form.register(
                "password"
              )}
            />

            <span className="text-xs text-red-400">

              {
                form.formState.errors
                  .password?.message
              }

            </span>

          </label>

          <label className="block space-y-2">

            <span className="text-sm font-medium text-white">
              Confirm password
            </span>

            <Input
              type="password"

              {...form.register(
                "confirmPassword"
              )}
            />

            <span className="text-xs text-red-400">

              {
                form.formState.errors
                  .confirmPassword
                  ?.message
              }

            </span>

          </label>

          <Button
            className="h-12 w-full"

            size="lg"

            variant="neon"

            disabled={loading}
          >

            <KeyRound className="size-5" />

            {
              loading
                ? "Updating..."
                : "Update Password"
            }

          </Button>

        </form>
      )}

    </AuthFormCard>
  );
}