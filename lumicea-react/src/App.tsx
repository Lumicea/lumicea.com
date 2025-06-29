import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import { HomePage } from "./pages/home/index.tsx"; // Changed
import { NotFoundPage } from "./pages/not-found/index.tsx"; // Changed
import { CartPage } from "./pages/cart/index.tsx"; // Changed
import { CheckoutPage } from "./pages/checkout/index.tsx"; // Changed
import { CheckoutSuccessPage } from "./pages/checkout/success/index.tsx"; // Changed
import { AboutPage } from "./pages/about/index.tsx"; // Changed
import { BlogPage } from "./pages/blog/index.tsx"; // Changed
import { ContactPage } from "./pages/contact/index.tsx"; // Changed
import { CustomPage } from "./pages/custom/index.tsx"; // Changed
import { GiftCardsPage } from "./pages/gift-cards/index.tsx"; // Changed
import { CollectionsPage } => "./pages/collections/index.tsx"; // Changed
import { SettingsPage } from "./pages/settings/index.tsx"; // Changed
import { SizeGuidePage } from "./pages/size-guide/index.tsx"; // Changed
import { LoginPage } from "./pages/auth/login/index.tsx"; // Changed
import { SignupPage } from "./pages/auth/signup/index.tsx"; // Changed
import { EarringsPage } from "./pages/categories/earrings/index.tsx"; // Changed
import { NoseRingsPage } from "./pages/categories/nose-rings/index.tsx"; // Changed
import { ProductDetailPage } from "./pages/products/detail/index.tsx"; // Changed

// Admin Pages
import { AdminDashboard } from "./pages/admin/dashboard/index.tsx"; // Changed
import { AdminProductsPage } => "./pages/admin/products/index.tsx"; // Changed
import { AdminOrdersPage } from "./pages/admin/orders/index.tsx"; // Changed
import { AdminCustomersPage } => "./pages/admin/customers/index.tsx"; // Changed
import { AdminPagesPage } from "./pages/admin/pages/index.tsx"; // Changed
import { AdminBlogPage } from "./pages/admin/blog/index.tsx"; // Changed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/custom" element={<CustomPage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
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
    </Router>
  );
}

export default App;