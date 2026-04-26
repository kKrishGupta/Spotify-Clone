import { cn } from "../../utils/helpers";

const variants = {
  primary: "bg-beat-gradient text-white shadow-glow hover:scale-[1.03]",
  secondary: "bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15",
  ghost: "text-white/70 hover:bg-white/10 hover:text-white",
};

const Button = ({ children, className = "", variant = "primary", type = "button", ...props }) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition duration-300 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
