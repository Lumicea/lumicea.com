// lumicea-react/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import ScrollToTop component
import { ScrollToTop } from '@/components/scroll-to-top';

// Import the Header component
import { Header } from './components/layout/header'; // Ensure this path is correct

// Pages
import { HomePage } from "@/pages/home/index.tsx";
import { NotFoundPage } from "@/pages/not-found/index.tsx";
import { CartPage } from "@/pages/cart/index.tsx";
import { CheckoutPage } from "@/pages/checkout/index.tsx";
import { WishlistPage } from "@/pages/wishlist/index.tsx";
import { SearchPage } from "@/pages/search/index.tsx";
import { GiftCardsPage } from "@/pages/gift-cards/index.tsx";
import { CheckoutSuccessPage } from "@/pages/checkout/success/index.tsx";
import { AboutPage } from "@/pages/about.tsx";
import { BlogPage } from "@/pages/blog.tsx";
import { ContactPage } from "@/pages/contact.tsx";
import { CustomPage } from "@/pages/custom.tsx";
import { CarePage } from "@/pages/care.tsx";
import { CollectionsPage } from "@/pages/collections.tsx";
import { SettingsPage } from "@/pages/settings.tsx";
import { LoginPage } from "@/pages/auth/login.tsx";
import { SignupPage } from "@/pages/auth/signup.tsx";
import { PrivacyPage } from "@/pages/legal/privacy.tsx";
import { CookiesPage } from "@/pages/legal/cookies.tsx";
import { TermsPage } from "@/pages/legal/terms.tsx";
import { EarringsPage } from "@/pages/categories/earrings.tsx";
import { NoseRingsPage } from "@/pages/categories/nose-rings.tsx";
import { ProductDetailPage } from "@/pages/products/detail.tsx";
import { SizeGuidePage } from "@/pages/size-guide.tsx";

// Admin Pages
import { AdminDashboard } from "@/pages/admin/dashboard/index.tsx";
import { AdminProductsPage } from "@/pages/admin/products/index.tsx";
import { AdminOrdersPage } from "@/pages/admin/orders/index.tsx";
import { AdminCustomersPage } from "@/pages/admin/customers/index.tsx";
import { AdminPagesPage } from "@/pages/admin/pages/index.tsx";
import { AdminBlogPage } from "@/pages/admin/blog/index.tsx";

// UI Components
import { CookieConsent } from './components/ui/cookie-consent.tsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/custom" element={<CustomPage />} />
        <Route path="/care" element={<CarePage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/legal/privacy" element={<PrivacyPage />} />
        <Route path="/legal/cookies" element={<CookiesPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/size-guide" element={<SizeGuidePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/categories/earrings" element={<EarringsPage />} />
        <Route path="/categories/nose-rings" element={<NoseRingsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/customers" element={<AdminCustomersPage />} />
        <Route path="/admin/pages" element={<AdminPagesPage />} />
        <Route path="/admin/blog" element={<AdminBlogPage />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CookieConsent />
    </Router>
  );
}

export default App;
