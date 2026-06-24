import { Component, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center" dir="rtl">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="font-extrabold text-gray-800 mb-1">משהו השתבש</p>
            <p className="text-sm text-gray-400">אנא רעננו את הדף ונסו שוב</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-2xl text-white font-bold text-sm"
            style={{ background: "var(--gradient-brand)" }}
          >
            רענון דף
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
