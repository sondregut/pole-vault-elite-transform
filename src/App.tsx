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
import MediaKitPro from "./pages/MediaKitPro";
import PVT from "./pages/PVT";
import VideoLibrary from "./pages/VideoLibrary";
import AdminVideos from "./pages/AdminVideos";
import Auth from "./pages/Auth";
import Upload from "./pages/Upload";
import SubmissionThankYou from "./pages/SubmissionThankYou";
import VaultLogin from "./pages/VaultLogin";
import VaultDashboard from "./pages/VaultDashboard";
import VaultEquipment from "./pages/VaultEquipment";
import VaultSessions from "./pages/VaultSessions";
import VaultSessionDetail from "./pages/VaultSessionDetail";
import VaultInvite from "./pages/VaultInvite";
import VaultProfile from "./pages/VaultProfile";
import VaultAnalytics from "./pages/VaultAnalytics";
import VaultVideos from "./pages/VaultVideos";
import VaultVideoTest from "./pages/VaultVideoTest";
import VaultDashboardLayout from "./pages/VaultDashboardLayout";
import VaultAdmin from "./pages/VaultAdmin";
import VaultAdminOverview from "./pages/VaultAdminOverview";
import VaultAdminUserInsights from "./pages/VaultAdminUserInsights";
import VaultAdminRevenue from "./pages/VaultAdminRevenue";
import VaultAdminTrainingAnalytics from "./pages/VaultAdminTrainingAnalytics";
import VaultAdminModeration from "./pages/VaultAdminModeration";
import VaultAdminNotifications from "./pages/VaultAdminNotifications";
import VaultAdminSystemHealth from "./pages/VaultAdminSystemHealth";
import VaultAdminVideoManagement from "./pages/VaultAdminVideoManagement";
import VaultAdminVideoDiagnostic from "./pages/VaultAdminVideoDiagnostic";
import VaultAdminDataManagement from "./pages/VaultAdminDataManagement";
import VaultAdminDataCleanup from "./pages/VaultAdminDataCleanup";
import VaultAdminPromoCodes from "./pages/VaultAdminPromoCodes";
import VaultAdminUsers from "./pages/VaultAdminUsers";
import VaultPrivacyPolicy from "./pages/VaultPrivacyPolicy";
import VaultTermsOfService from "./pages/VaultTermsOfService";
import VaultAppLanding from "./pages/VaultAppLanding";
import VaultSubscriptionSuccess from "./pages/VaultSubscriptionSuccess";
import VaultOnboarding from "./pages/VaultOnboarding";
import VaultSignup from "./pages/VaultSignup";
import VaultCheckout from "./pages/VaultCheckout";
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
            <Route path="/media-kit" element={<MediaKit />} />
            <Route path="/sondre-media" element={<MediaKitPro />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/pvt" element={<PVT />} />
            <Route path="/video-library" element={<VideoLibrary />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/vault" element={<VaultAppLanding />} />
            <Route path="/vault/login" element={<VaultLogin />} />
            <Route path="/vault/signup" element={<VaultSignup />} />
            <Route path="/vault/checkout" element={<VaultCheckout />} />
            <Route path="/vault/subscription-success" element={<VaultSubscriptionSuccess />} />
            <Route path="/vault/onboarding" element={<VaultOnboarding />} />
            <Route path="/vault/invite/:inviteCode" element={<VaultInvite />} />
            <Route path="/vault" element={<VaultDashboardLayout />}>
              <Route path="dashboard" element={<VaultDashboard />} />
              <Route path="equipment" element={<VaultEquipment />} />
              <Route path="sessions" element={<VaultSessions />} />
              <Route path="sessions/:sessionId" element={<VaultSessionDetail />} />
              <Route path="videos" element={<VaultVideos />} />
              <Route path="video-test" element={<VaultVideoTest />} />
              <Route path="profile" element={<VaultProfile />} />
              <Route path="analytics" element={<VaultAnalytics />} />
            </Route>
            <Route path="/vault/admin" element={<VaultAdmin />}>
              <Route index element={<VaultAdminOverview />} />
              <Route path="user-insights" element={<VaultAdminUserInsights />} />
              <Route path="revenue" element={<VaultAdminRevenue />} />
              <Route path="training-analytics" element={<VaultAdminTrainingAnalytics />} />
              <Route path="moderation" element={<VaultAdminModeration />} />
              <Route path="notifications" element={<VaultAdminNotifications />} />
              <Route path="system-health" element={<VaultAdminSystemHealth />} />
              <Route path="videos" element={<VaultAdminVideoManagement />} />
              <Route path="videos/diagnostic" element={<VaultAdminVideoDiagnostic />} />
              <Route path="data-management" element={<VaultAdminDataManagement />} />
              <Route path="data-cleanup" element={<VaultAdminDataCleanup />} />
              <Route path="promo-codes" element={<VaultAdminPromoCodes />} />
              <Route path="users" element={<VaultAdminUsers />} />
            </Route>
            <Route path="/vault/privacy" element={<VaultPrivacyPolicy />} />
            <Route path="/vault/terms" element={<VaultTermsOfService />} />
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
