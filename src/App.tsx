import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;
