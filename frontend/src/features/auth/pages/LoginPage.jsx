import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Mail,
  Lock,
  WandSparkles,
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
  loginSchema,
  otpSchema,
} from "@/features/auth/validations/auth.schema";

export default function LoginPage() {

  useDocumentTitle(
    "Login",
    "Access BeatFlow AI dashboards."
  );

  const navigate =
    useNavigate();

  const login =
    useAuthStore(
      (state) =>
        state.login
    );

  const loginOtp =
    useAuthStore(
      (state) =>
        state.loginOtp
    );

  const verifyLoginOtp =
    useAuthStore(
      (state) =>
        state.verifyLoginOtp
    );

  const [mode, setMode] =
    useState("password");

  const [otpSent, setOtpSent] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  // PASSWORD FORM
  const passwordForm =
    useAuthForm(
      loginSchema,

      {
        email: "",
        password: "",
      }
    );

  // OTP FORM
  const otpForm =
    useAuthForm(
      otpSchema,

      {
        otp: "",
      }
    );

  // ✅ PASSWORD LOGIN
  const handlePasswordLogin =
    passwordForm.handleSubmit(
      async (values) => {

        try {

          setError("");

          await login(
            values
          );

          toast.success(
            "Login successful"
          );

          navigate(
            "/app/home"
          );

        } catch (err) {

          setError(

            err?.message ||

            "Authentication failed"
          );
        }
      }
    );

  // ✅ SEND OTP
  const handleSendOtp =
    async () => {

      try {

        if (!email) {

          return toast.error(
            "Enter email first"
          );
        }

        await loginOtp({
          email,
        });

        setOtpSent(true);

        toast.success(
          "OTP sent successfully"
        );

      } catch (err) {

        toast.error(

          err?.message ||

          "Failed to send OTP"
        );
      }
    };

  // ✅ VERIFY LOGIN OTP
  const handleVerifyOtp =
    otpForm.handleSubmit(
      async (values) => {

        try {

          const response =
            await verifyLoginOtp({

              email,

              otp:
                values.otp,
            });

          toast.success(
            "Login successful"
          );

          navigate(
            "/app/home"
          );

        } catch (err) {

          toast.error(

            err?.message ||

            "Invalid OTP"
          );
        }
      }
    );

  return (

    <AuthFormCard

      title="Welcome back"

      description="Login securely with password or OTP."

      footer={
        <>
          New to BeatFlow?{" "}

          <Link
            className="font-semibold text-pulse hover:text-white"
            to="/register"
          >
            Create an account
          </Link>
        </>
      }
    >

      {/* MODE SWITCH */}
      <div className="mb-5 flex rounded-xl border border-white/10 bg-white/5 p-1">

        <button
          type="button"

          onClick={() =>
            setMode(
              "password"
            )
          }

          className={`flex-1 rounded-lg px-4 py-2 text-sm transition ${
            mode === "password"
              ? "bg-pulse text-black"
              : "text-white"
          }`}
        >
          Password
        </button>

        <button
          type="button"

          onClick={() =>
            setMode(
              "otp"
            )
          }

          className={`flex-1 rounded-lg px-4 py-2 text-sm transition ${
            mode === "otp"
              ? "bg-pulse text-black"
              : "text-white"
          }`}
        >
          OTP Login
        </button>

      </div>

      {/* PASSWORD LOGIN */}
      {mode === "password" && (

        <form
          className="space-y-4"
          onSubmit={
            handlePasswordLogin
          }
        >

          <label className="block space-y-2">

            <span className="text-sm font-medium text-white">
              Email
            </span>

            <div className="relative">

              <Mail className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />

              <Input
                className="pl-10"

                placeholder="Enter email"

                {...passwordForm.register(
                  "email"
                )}
              />

            </div>

          </label>

          <label className="block space-y-2">

            <span className="text-sm font-medium text-white">
              Password
            </span>

            <div className="relative">

              <Lock className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />

              <Input
                type="password"

                className="pl-10"

                placeholder="Enter password"

                {...passwordForm.register(
                  "password"
                )}
              />

            </div>

          </label>

          {error ? (
            <p className="text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <Button
            className="w-full"

            variant="neon"

            size="lg"
          >

            <WandSparkles className="size-5" />

            Enter platform

          </Button>

        </form>
      )}

      {/* OTP LOGIN */}
      {mode === "otp" && (

        <div className="space-y-4">

          <label className="block space-y-2">

            <span className="text-sm font-medium text-white">
              Email
            </span>

            <div className="relative">

              <Mail className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />

              <Input
                className="pl-10"

                value={email}

                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }

                placeholder="Enter email"
              />

            </div>

          </label>

          {!otpSent ? (

            <Button
              className="w-full"

              variant="neon"

              onClick={
                handleSendOtp
              }
            >

              Send OTP

            </Button>

          ) : (

            <form
              className="space-y-4"
              onSubmit={
                handleVerifyOtp
              }
            >

              <Input
                className="h-14 text-center text-2xl tracking-[0.25em]"

                maxLength={6}

                inputMode="numeric"

                autoComplete="one-time-code"

                placeholder="000000"

                {...otpForm.register(
                  "otp",

                  {
                    setValueAs: (v) =>
                      v
                        ?.replace(/\s/g, "")
                        ?.trim(),
                  }
                )}
              />

              <Button
                className="w-full"

                variant="neon"
              >

                <ShieldCheck className="size-5" />

                Verify OTP

              </Button>

            </form>
          )}

        </div>
      )}

      <div className="mt-4 text-sm">

        <Link
          className="text-muted-foreground hover:text-pulse"
          to="/forgot-password"
        >
          Forgot password
        </Link>

      </div>

    </AuthFormCard>
  );
}