import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

function App(): React.JSX.Element {
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}

export default App;
