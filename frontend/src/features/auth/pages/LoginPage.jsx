import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AuthFormCard } from "@/features/auth/components/AuthFormCard";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { loginSchema } from "@/features/auth/validations/auth.schema";

export default function LoginPage() {
  useDocumentTitle("Login", "Access BeatFlow AI dashboards and realtime music intelligence.");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const form = useAuthForm(loginSchema, {
    email: "admin@beatflow.ai",
    password: "password123",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    try {
      await login(values);
      navigate("/app/home");
    } catch {
      setError("Unable to authenticate this session.");
    }
  });

  return (
    <AuthFormCard
      title="Welcome back"
      description="Enter the neural console with a listener, artist, or admin email."
      footer={
        <>
          New to BeatFlow?{" "}
          <Link className="font-semibold text-pulse hover:text-white" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
            <Input className="pl-10" placeholder="admin@beatflow.ai" {...form.register("email")} />
          </div>
          <span className="text-xs text-ember">{form.formState.errors.email?.message}</span>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
            <Input className="pl-10" type="password" placeholder="password123" {...form.register("password")} />
          </div>
          <span className="text-xs text-ember">{form.formState.errors.password?.message}</span>
        </label>
        {error ? <p className="text-sm text-ember">{error}</p> : null}
        <Button className="w-full" variant="neon" size="lg" disabled={form.formState.isSubmitting}>
          <WandSparkles className="size-5" />
          {form.formState.isSubmitting ? "Authenticating" : "Enter platform"}
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Link className="text-muted-foreground hover:text-pulse" to="/forgot-password">
          Forgot password
        </Link>
        <Link className="text-muted-foreground hover:text-pulse" to="/otp">
          Verify OTP
        </Link>
      </div>
    </AuthFormCard>
  );
}
