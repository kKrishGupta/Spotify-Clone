import { Link, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AuthFormCard } from "@/features/auth/components/AuthFormCard";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { resetPasswordSchema } from "@/features/auth/validations/auth.schema";

export default function ResetPasswordPage() {
  useDocumentTitle("Reset Password", "Set a new BeatFlow AI password.");
  const navigate = useNavigate();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const form = useAuthForm(resetPasswordSchema, { password: "password123", confirmPassword: "password123" });

  const onSubmit = form.handleSubmit(async (values) => {
    await resetPassword(values);
    navigate("/login");
  });

  return (
    <AuthFormCard
      title="Set a new password"
      description="Refresh your account credentials and return to the command center."
      footer={
        <Link className="font-semibold text-pulse hover:text-white" to="/login">
          Back to login
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">New password</span>
          <Input type="password" {...form.register("password")} />
          <span className="text-xs text-ember">{form.formState.errors.password?.message}</span>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Confirm password</span>
          <Input type="password" {...form.register("confirmPassword")} />
          <span className="text-xs text-ember">{form.formState.errors.confirmPassword?.message}</span>
        </label>
        <Button className="w-full" size="lg" variant="neon" disabled={form.formState.isSubmitting}>
          <KeyRound className="size-5" />
          Reset password
        </Button>
      </form>
    </AuthFormCard>
  );
}
