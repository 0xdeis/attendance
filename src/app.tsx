import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./index.css";
import { Suspense } from "solid-js";
import { Nav } from "./components/nav";

export default function App() {
  return (
    <Router
      root={(props) => (
        <div>
          <Nav />
          <Suspense>{props.children}</Suspense>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
