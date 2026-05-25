import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AppRoutes } from "@/app/routes";

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}