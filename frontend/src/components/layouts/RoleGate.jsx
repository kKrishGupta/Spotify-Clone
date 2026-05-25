import {
  Navigate,
} from "react-router-dom";

import {
  useAuthStore,
} from "@/features/auth/store/auth.store";

export function RoleGate({

  children,

  roles = [],
}) {

  const {

    user,

    hydrated,
  } =
    useAuthStore();

  // ✅ WAIT FOR STORE HYDRATION
  if (!hydrated) {

    return null;
  }

  // ✅ ROLE CHECK
  if (

    !user ||

    !roles.includes(
      user.role
    )
  ) {

    return (

      <Navigate
        to="/app/home"
        replace
      />
    );
  }

  return children;
}