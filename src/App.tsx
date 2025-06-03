import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminSyncWaitlist from "./pages/AdminSyncWaitlist";
import Auth from "./pages/Auth";
import Subscribe from "./pages/Subscribe";
import VideoLibrary from "./pages/VideoLibrary";

const queryClient = new QueryClient();

function App() {
  return (
    <CartProvider>
      <QueryClient client={queryClient}>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
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
            <Route path="/admin/sync-waitlist" element={<AdminSyncWaitlist />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/video-library" element={<VideoLibrary />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClient>
    </CartProvider>
  );
}

export default App;
