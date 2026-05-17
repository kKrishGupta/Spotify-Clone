import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AuthFormCard } from "@/features/auth/components/AuthFormCard";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { forgotPasswordSchema } from "@/features/auth/validations/auth.schema";

export default function ForgotPasswordPage() {
  useDocumentTitle("Forgot Password", "Request BeatFlow AI password recovery.");
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [sent, setSent] = useState(false);
  const form = useAuthForm(forgotPasswordSchema, { email: "listener@beatflow.ai" });

  const onSubmit = form.handleSubmit(async (values) => {
    await forgotPassword(values);
    setSent(true);
  });

  return (
    <AuthFormCard
      title="Recover access"
      description="Send a secure recovery link to the email connected with your BeatFlow profile."
      footer={
        <Link className="font-semibold text-pulse hover:text-white" to="/login">
          Back to login
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Email</span>
          <Input {...form.register("email")} />
          <span className="text-xs text-ember">{form.formState.errors.email?.message}</span>
        </label>
        {sent ? <p className="rounded-md bg-pulse/10 p-3 text-sm text-pulse">Recovery instructions were queued.</p> : null}
        <Button className="w-full" size="lg" variant="neon" disabled={form.formState.isSubmitting}>
          <MailCheck className="size-5" />
          Send recovery link
        </Button>
      </form>
    </AuthFormCard>
  );
}
