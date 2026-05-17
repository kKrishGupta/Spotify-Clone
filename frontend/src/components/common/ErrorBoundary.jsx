import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("BeatFlow UI boundary", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-night p-6 text-center">
          <div className="glass max-w-md rounded-lg p-8">
            <AlertTriangle className="mx-auto size-10 text-ember" />
            <h1 className="mt-4 font-display text-2xl font-semibold text-white">Interface stream interrupted</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The frontend recovered safely. Refresh the session to rehydrate the realtime state.
            </p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
