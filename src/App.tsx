import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import { HomePage } from "./pages/home/Home.tsx"; // Corrected: points to Home.tsx
import { NotFoundPage } from "./pages/not-found/NotFound.tsx"; // Corrected: points to NotFound.tsx
import { CartPage } from "./pages/cart/Cart.tsx"; // Corrected: points to Cart.tsx
import { CheckoutPage } from "./pages/checkout/Checkout.tsx"; // Corrected: points to Checkout.tsx
import { CheckoutSuccessPage } from "./pages/checkout/success/Success.tsx"; // Corrected: points to Success.tsx
import { AboutPage } from "./pages/about.tsx"; // Correct
import { BlogPage } from "./pages/blog.tsx"; // Correct
import { ContactPage } from "./pages/contact.tsx"; // Correct
import { CustomPage } from "./pages/custom.tsx"; // Correct
import { GiftCardsPage } from "./pages/gift-cards.tsx"; // Correct
import { CollectionsPage } from "./pages/collections.tsx"; // Correct
import { SettingsPage } from "./pages/settings.tsx"; // Correct
import { SizeGuidePage } from "./pages/size-guide.tsx"; // Correct
import { LoginPage } from "./pages/auth/Login.tsx"; // Corrected: points to Login.tsx
import { SignupPage } from "./pages/auth/Signup.tsx"; // Corrected: points to Signup.tsx
import { EarringsPage } from "./pages/categories/Earrings.tsx"; // Corrected: points to Earrings.tsx
import { NoseRingsPage } from "./pages/categories/NoseRings.tsx"; // Corrected: points to NoseRings.tsx
import { ProductDetailPage } from "./pages/products/Detail.tsx"; // Corrected: points to Detail.tsx

// Admin Pages
import { AdminDashboard } from "./pages/admin/dashboard/Dashboard.tsx"; // Corrected: points to Dashboard.tsx
import { AdminProductsPage } from "./pages/admin/products/Products.tsx"; // Corrected: points to Products.tsx
import { AdminOrdersPage } from "./pages/admin/orders/Orders.tsx"; // Corrected: points to Orders.tsx
import { AdminCustomersPage } from "./pages/admin/customers/Customers.tsx"; // Corrected: points to Customers.tsx
import { AdminPagesPage } from "./pages/admin/pages/Pages.tsx"; // Corrected: points to Pages.tsx
import { AdminBlogPage } from "./pages/admin/blog/Blog.tsx"; // Corrected: points to Blog.tsx

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