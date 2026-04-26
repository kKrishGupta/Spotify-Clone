import { forwardRef } from "react";
import { cn } from "../../utils/helpers";

const Input = forwardRef(({ className = "", icon: Icon, ...props }, ref) => {
  return (
    <label className="relative block">
      {Icon ? (
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
      ) : null}
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.075] px-4 text-sm font-medium text-white outline-none transition duration-300 placeholder:text-white/35 focus:border-beatPink/50 focus:bg-white/10 focus:shadow-glow",
          Icon && "pl-12",
          className,
        )}
        {...props}
      />
    </label>
  );
});

Input.displayName = "Input";

export default Input;
