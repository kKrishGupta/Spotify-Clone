import { Lock, Mail, Music2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../utils/helpers";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const { handleLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await handleLogin(form);

      // ✅ redirect based on role
      navigate(getRoleHome(user.role), { replace: true });
    } catch (err) {
      // ✅ REAL BACKEND ERROR MESSAGE
      setError(
        err?.response?.data?.message ||
          "Invalid email or password"
      );
    }
  };

  return (
    <AuthShell title="Sign In" subtitle="Welcome back to BeatFlow">
      <form onSubmit={submit} className="space-y-4">
        <Input
          icon={Mail}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        <Input
          icon={Lock}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
        />

        {error && (
          <p className="text-sm font-medium text-red-400">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-white/50">
        New to BeatFlow?{" "}
        <Link
          to="/register"
          className="font-bold text-beatPink hover:text-white"
        >
          Create account
        </Link>
      </p>
    </AuthShell>
  );
};

const AuthShell = ({ title, subtitle, children }) => (
  <main className="relative grid min-h-screen place-items-center overflow-hidden bg-night p-4 text-white">
    <div className="absolute inset-0 bg-beat-radial" />
    <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-beatPink/20 blur-3xl" />

    <div className="glass-panel relative w-full max-w-md rounded-[2rem] p-7 shadow-glow">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-beat-gradient shadow-glow">
          <Music2 className="h-8 w-8" fill="currentColor" />
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-beatPink ring-1 ring-white/10">
          <Sparkles className="h-3.5 w-3.5" />
          BeatFlow
        </div>

        <h1 className="text-3xl font-extrabold text-white">
          {title}
        </h1>

        <p className="mt-2 text-sm font-medium text-white/50">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  </main>
);

export default Login;