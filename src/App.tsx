import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OneOnOneCoaching from "./pages/OneOnOneCoaching";
import About from "./pages/About";
import ComingSoon from "./pages/ComingSoon";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import DigitalDownloads from "./pages/DigitalDownloads";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Programs from "./pages/Programs";
import MediaKit from "./pages/MediaKit";
import PVT from "./pages/PVT";
import VideoLibrary from "./pages/VideoLibrary";
import AdminVideos from "./pages/AdminVideos";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";
import SubmissionThankYou from "./pages/SubmissionThankYou";
import VaultLanding from "./pages/VaultLanding";
import VaultLogin from "./pages/VaultLogin";
import VaultDashboard from "./pages/VaultDashboard";
import VaultEquipment from "./pages/VaultEquipment";
import VaultSessions from "./pages/VaultSessions";
import VaultSessionDetail from "./pages/VaultSessionDetail";
import VaultInvite from "./pages/VaultInvite";
import VaultAdmin from "./pages/VaultAdmin";
import VaultAdminOverview from "./pages/VaultAdminOverview";
import VaultAdminPromoCodes from "./pages/VaultAdminPromoCodes";
import VaultAdminUsers from "./pages/VaultAdminUsers";
import VaultPrivacyPolicy from "./pages/VaultPrivacyPolicy";
import VaultTermsOfService from "./pages/VaultTermsOfService";
import PointsCalculator from "./pages/PointsCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/submission-thank-you" element={<SubmissionThankYou />} />
            <Route path="/coaching" element={<OneOnOneCoaching />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/shop/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="/downloads" element={<DigitalDownloads />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/mediakit" element={<MediaKit />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/pvt" element={<PVT />} />
            <Route path="/video-library" element={<VideoLibrary />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/vault" element={<VaultLanding />} />
            <Route path="/vault/login" element={<VaultLogin />} />
            <Route path="/vault/dashboard" element={<VaultDashboard />} />
            <Route path="/vault/equipment" element={<VaultEquipment />} />
            <Route path="/vault/sessions" element={<VaultSessions />} />
            <Route path="/vault/sessions/:sessionId" element={<VaultSessionDetail />} />
            <Route path="/vault/invite/:inviteCode" element={<VaultInvite />} />
            <Route path="/vault/admin" element={<VaultAdmin />}>
              <Route index element={<VaultAdminOverview />} />
              <Route path="promo-codes" element={<VaultAdminPromoCodes />} />
              <Route path="users" element={<VaultAdminUsers />} />
            </Route>
            <Route path="/vault/privacy" element={<VaultPrivacyPolicy />} />
            <Route path="/vault/terms" element={<VaultTermsOfService />} />
            <Route path="/vault-app-secure" element={<VaultLanding />} />
            <Route path="/points-calculator" element={<PointsCalculator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
