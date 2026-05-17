import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useAuthForm(schema, defaultValues) {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });
}
