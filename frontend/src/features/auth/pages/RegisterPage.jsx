import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Mail,
  UserRound,
  Lock,
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
  registerSchema,
} from "@/features/auth/validations/auth.schema";

export default function RegisterPage() {

  useDocumentTitle(
    "Register",
    "Create your BeatFlow AI account."
  );

  const navigate =
    useNavigate();

  const registerUser =
    useAuthStore(
      (state) =>
        state.register
    );

  const form =
    useAuthForm(
      registerSchema,

      {
        username: "",
        email: "",
        password: "",
        role: "user",
      }
    );

  const onSubmit =
    form.handleSubmit(
      async (values) => {

        try {

          await registerUser({

            username:
              values.username,

            email:
              values.email,

            password:
              values.password,

            role:
              values.role,
          });

          toast.success(
            "OTP sent to your email"
          );

          navigate(
            "/otp",

            {
              state: {
                email:
                  values.email,
              },
            }
          );

        } catch (err) {

          toast.error(

            err?.response?.data?.message ||

            err?.message ||

            "Registration failed"
          );
        }
      }
    );

  return (

    <AuthFormCard

      title="Create your sonic identity"

      description="Register your BeatFlow AI account and verify your email securely."

      footer={
        <>
          Already have access?{" "}

          <Link
            className="font-semibold text-pulse hover:text-white"
            to="/login"
          >
            Log in
          </Link>
        </>
      }
    >

      <form
        className="space-y-5"
        onSubmit={onSubmit}
      >

        {/* USERNAME */}
        <label className="block space-y-2">

          <span className="text-sm font-medium text-white">
            Username
          </span>

          <div className="relative">

            <UserRound className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />

            <Input
              placeholder="Choose username"

              className="pl-10"

              {...form.register(
                "username"
              )}
            />

          </div>

          <span className="text-xs text-red-400">

            {
              form.formState.errors
                .username?.message
            }

          </span>

        </label>

        {/* EMAIL */}
        <label className="block space-y-2">

          <span className="text-sm font-medium text-white">
            Email
          </span>

          <div className="relative">

            <Mail className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />

            <Input
              type="email"

              placeholder="Enter email"

              className="pl-10"

              {...form.register(
                "email"
              )}
            />

          </div>

          <span className="text-xs text-red-400">

            {
              form.formState.errors
                .email?.message
            }

          </span>

        </label>

        {/* PASSWORD */}
        <label className="block space-y-2">

          <span className="text-sm font-medium text-white">
            Password
          </span>

          <div className="relative">

            <Lock className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />

            <Input
              type="password"

              placeholder="Create password"

              className="pl-10"

              {...form.register(
                "password"
              )}
            />

          </div>

          <span className="text-xs text-red-400">

            {
              form.formState.errors
                .password?.message
            }

          </span>

        </label>

        {/* ROLE */}
        <label className="block space-y-2">

          <span className="text-sm font-medium text-white">
            Account Type
          </span>

          <select

            className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none"

            {...form.register(
              "role"
            )}
          >

            <option value="user">
              Listener
            </option>

            <option value="artist">
              Artist
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

        </label>

        {/* SUBMIT */}
        <Button
          className="w-full"

          size="lg"

          variant="neon"

          disabled={
            form.formState
              .isSubmitting
          }
        >

          {
            form.formState
              .isSubmitting

              ? "Creating account..."

              : "Create account"
          }

        </Button>

      </form>

    </AuthFormCard>
  );
}