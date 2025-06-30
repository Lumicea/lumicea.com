import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import { HomePage } from "./pages/home/index.tsx"; // Confirmed path 
import { NotFoundPage } from "./pages/not-found/index.tsx"; // Confirmed path 
import { CartPage } from "./pages/cart/index.tsx"; // Confirmed path 
import { CheckoutPage } from "./pages/checkout/index.tsx"; // Confirmed path 
import { CheckoutSuccessPage } from "./pages/checkout/success/index.tsx"; // Confirmed path 
import { AboutPage } from "./pages/about.tsx"; // Confirmed path 
import { BlogPage } from "./pages/blog.tsx"; // Confirmed path 
import { ContactPage } from "./pages/contact.tsx"; // Confirmed path 
import { CustomPage } from "./pages/custom.tsx"; // Confirmed path 
import { GiftCardsPage } from "./pages/gift-cards.tsx"; // Confirmed path 
import { CollectionsPage } from "./pages/collections.tsx"; // Confirmed path 
import { SettingsPage } from "./pages/settings.tsx"; // Confirmed path 
import { SizeGuidePage } from "./pages/size-guide.tsx"; // Confirmed path 
import { LoginPage } from "./pages/auth/login.tsx"; // Confirmed path 
import { SignupPage } from "./pages/auth/signup.tsx"; // Confirmed path 
import { EarringsPage } from "./pages/categories/earrings.tsx"; // Confirmed path 
import { NoseRingsPage } from "./pages/categories/nose-rings.tsx"; // Confirmed path 
import { ProductDetailPage } from "./pages/products/detail.tsx"; // Confirmed path 

// Admin Pages
import { AdminDashboard } from "./pages/admin/dashboard/index.tsx"; // Confirmed path 
import { AdminProductsPage } from "./pages/admin/products/index.tsx"; // Confirmed path 
import { AdminOrdersPage } from "./pages/admin/orders/index.tsx"; // Confirmed path 
import { AdminCustomersPage } from "./pages/admin/customers/index.tsx"; // Confirmed path 
import { AdminPagesPage } from "./pages/admin/pages/index.tsx"; // Confirmed path 
import { AdminBlogPage } from "./pages/admin/blog/index.tsx"; // Confirmed path 


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
