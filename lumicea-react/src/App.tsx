import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import { HomePage } from "./Pages/home/index.tsx"; // Changed
import { NotFoundPage } from "./Pages/not-found/index.tsx"; // Changed
import { CartPage } from "./Pages/cart/index.tsx"; // Changed
import { CheckoutPage } from "./Pages/checkout/index.tsx"; // Changed
import { CheckoutSuccessPage } from "./Pages/checkout/success/index.tsx"; // Changed
import { AboutPage } from "./Pages/about/index.tsx"; // Changed
import { BlogPage } from "./Pages/blog/index.tsx"; // Changed
import { ContactPage } from "./Pages/contact/index.tsx"; // Changed
import { CustomPage } from "./Pages/custom/index.tsx"; // Changed
import { GiftCardsPage } from "./Pages/gift-cards/index.tsx"; // Changed
import { CollectionsPage } from "./Pages/collections/index.tsx"; // Changed
import { SettingsPage } from "./Pages/settings/index.tsx"; // Changed
import { SizeGuidePage } from "./Pages/size-guide/index.tsx"; // Changed
import { LoginPage } from "./Pages/auth/login/index.tsx"; // Changed
import { SignupPage } from "./Pages/auth/signup/index.tsx"; // Changed
import { EarringsPage } from "./Pages/categories/earrings/index.tsx"; // Changed
import { NoseRingsPage } from "./Pages/categories/nose-rings/index.tsx"; // Changed
import { ProductDetailPage } from "./Pages/products/detail/index.tsx"; // Changed

// Admin Pages
import { AdminDashboard } from "./Pages/admin/dashboard/index.tsx"; // Changed
import { AdminProductsPage } from "./Pages/admin/products/index.tsx"; // Changed
import { AdminOrdersPage } from "./Pages/admin/orders/index.tsx"; // Changed
import { AdminCustomersPage } from "./Pages/admin/customers/index.tsx"; // Changed
import { AdminPagesPage } from "./Pages/admin/pages/index.tsx"; // Changed
import { AdminBlogPage } from "./Pages/admin/blog/index.tsx"; // Changed

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