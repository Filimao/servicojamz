import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import ForProfessionals from "./pages/ForProfessionals";
import ProviderRegistration from "./pages/ProviderRegistration";
import ProviderProfile from "./pages/ProviderProfile";
import HowItWorksPage from "./pages/HowItWorks";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ServiceRequest from "./pages/ServiceRequest";
import MyRequests from "./pages/MyRequests";
import ProviderDashboard from "./pages/ProviderDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/para-profissionais" element={<ForProfessionals />} />
            <Route path="/cadastro-profissional" element={<ProviderRegistration />} />
            <Route path="/profissional/:id" element={<ProviderProfile />} />
            <Route path="/como-funciona" element={<HowItWorksPage />} />
            <Route path="/termos-de-uso" element={<TermsOfService />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="/solicitar-servico/:providerId" element={<ServiceRequest />} />
            <Route path="/meus-pedidos" element={<MyRequests />} />
            <Route path="/painel" element={<ProviderDashboard />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/providers" element={<AdminProviders />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
