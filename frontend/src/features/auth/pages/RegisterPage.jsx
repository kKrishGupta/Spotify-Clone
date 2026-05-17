import { Link, useNavigate } from "react-router-dom";
import { Mail, UserRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AuthFormCard } from "@/features/auth/components/AuthFormCard";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { registerSchema } from "@/features/auth/validations/auth.schema";

export default function RegisterPage() {
  useDocumentTitle("Register", "Create a BeatFlow AI listener account.");
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const form = useAuthForm(registerSchema, {
    name: "Anaya Rao",
    email: "listener@beatflow.ai",
    password: "password123",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await registerUser(values);
    navigate("/otp");
  });

  return (
    <AuthFormCard
      title="Create your sonic identity"
      description="Start with a listener profile and upgrade into creator tooling whenever you are ready."
      footer={
        <>
          Already have access?{" "}
          <Link className="font-semibold text-pulse hover:text-white" to="/login">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Name</span>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
            <Input className="pl-10" {...form.register("name")} />
          </div>
          <span className="text-xs text-ember">{form.formState.errors.name?.message}</span>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
            <Input className="pl-10" {...form.register("email")} />
          </div>
          <span className="text-xs text-ember">{form.formState.errors.email?.message}</span>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" />
            <Input className="pl-10" type="password" {...form.register("password")} />
          </div>
          <span className="text-xs text-ember">{form.formState.errors.password?.message}</span>
        </label>
        <Button className="w-full" size="lg" variant="neon" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account" : "Create account"}
        </Button>
      </form>
    </AuthFormCard>
  );
}
