import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorPage } from "../pages/ErrorPage";

interface State {
  failed: boolean;
}

/** Last-resort boundary. Route-level errors use router errorElement instead. */
export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Kagōunga app crashed", error, info);
  }

  render(): ReactNode {
    return this.state.failed ? <ErrorPage /> : this.props.children;
  }
}
