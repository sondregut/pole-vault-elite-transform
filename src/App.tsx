
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import NotFound from "./pages/NotFound";
import OneOnOneCoaching from "./pages/OneOnOneCoaching";
import About from "./pages/About";
import ComingSoon from "./pages/ComingSoon";
import RedirectToApp from "./components/RedirectToApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/app" element={<ComingSoon />} />
          {/* All other routes now redirect to /app */}
          <Route path="/" element={<RedirectToApp />} />
          <Route path="/programs" element={<RedirectToApp />} />
          <Route path="/coaching" element={<RedirectToApp />} />
          <Route path="/about" element={<RedirectToApp />} />
          <Route path="/coming-soon" element={<RedirectToApp />} />
          <Route path="*" element={<RedirectToApp />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
