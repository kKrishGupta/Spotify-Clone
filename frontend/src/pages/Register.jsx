import { Lock, Mail, Music2, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../utils/helpers";

const Register = () => {
  const [form, setForm] = useState({ username: "Krish", email: "krish5@gmail.com", password: "beatflow", role: "user" });
  const [error, setError] = useState("");
  const { handleRegister, isLoading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await handleRegister(form);
      navigate(getRoleHome(user.role), { replace: true });
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-night p-4 text-white">
      <div className="absolute inset-0 bg-beat-radial" />
      <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-beatPurple/25 blur-3xl" />
      <div className="glass-panel relative w-full max-w-md rounded-[2rem] p-7 shadow-glow">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-beat-gradient shadow-glow">
            <Music2 className="h-8 w-8" fill="currentColor" />
          </div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-beatPink ring-1 ring-white/10">
            <Sparkles className="h-3.5 w-3.5" /> BeatFlow
          </div>
          <h1 className="text-3xl font-extrabold text-white">Sign Up</h1>
          <p className="mt-2 text-sm font-medium text-white/50">Create your account</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            icon={User}
            placeholder="Username"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <select
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.075] px-4 text-sm font-semibold text-white outline-none transition duration-300 focus:border-beatPink/50 focus:shadow-glow"
          >
            <option className="bg-night" value="user">User</option>
            <option className="bg-night" value="artist">Artist</option>
            <option className="bg-night" value="admin">Admin</option>
          </select>
          {error ? <p className="text-sm font-medium text-red-300">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-beatPink hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
