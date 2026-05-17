import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { AuthFormCard } from "@/features/auth/components/AuthFormCard";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { otpSchema } from "@/features/auth/validations/auth.schema";

export default function OtpPage() {
  useDocumentTitle("Verify OTP", "Verify a BeatFlow AI login with a one time code.");
  const navigate = useNavigate();
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const [verified, setVerified] = useState(false);
  const form = useAuthForm(otpSchema, { code: "248816" });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await verifyOtp(values);
    setVerified(result.verified);
    if (result.verified) {
      window.setTimeout(() => navigate("/app/home"), 450);
    }
  });

  return (
    <AuthFormCard
      title="Verify secure entry"
      description="Confirm the code sent to your device and continue into BeatFlow AI."
      footer={
        <Link className="font-semibold text-pulse hover:text-white" to="/login">
          Return to login
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Verification code</span>
          <Input className="text-center text-xl tracking-[0.35em]" maxLength={6} {...form.register("code")} />
          <span className="text-xs text-ember">{form.formState.errors.code?.message}</span>
        </label>
        {verified ? <p className="rounded-md bg-volt/10 p-3 text-sm text-volt">Verified. Loading your console.</p> : null}
        <Button className="w-full" size="lg" variant="neon" disabled={form.formState.isSubmitting}>
          <ShieldCheck className="size-5" />
          Verify
        </Button>
      </form>
    </AuthFormCard>
  );
}
