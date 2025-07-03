import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import { HomePage } from "./lumicea-react/pages/home/index.tsx";
import { NotFoundPage } from "./lumicea-react/pages/not-found/index.tsx";
import { CartPage } from "./lumicea-react/pages/cart/index.tsx";
import { CheckoutPage } from "./lumicea-react/pages/checkout/index.tsx";
import { CheckoutSuccessPage } from "./lumicea-react/pages/checkout/success/index.tsx";
import { AboutPage } from "./lumicea-react/pages/about.tsx";
import { BlogPage } from "./lumicea-react/pages/blog.tsx";
import { ContactPage } from "./lumicea-react/pages/contact.tsx";
import { CustomPage } from "./lumicea-react/pages/custom.tsx";
import { GiftCardsPage } from "./lumicea-react/pages/gift-cards.tsx";
import { CollectionsPage } from "./lumicea-react/pages/collections.tsx";
import { SettingsPage } from "./lumicea-react/pages/settings.tsx";
import { SizeGuidePage } from "./lumicea-react/pages/size-guide.tsx";
import { LoginPage } from "./lumicea-react/pages/auth/Login.tsx";
import { SignupPage } from "./lumicea-react/pages/auth/Signup.tsx";
import { EarringsPage } from "./lumicea-react/pages/categories/earrings.tsx";
import { NoseRingsPage } from "./lumicea-react/pages/categories/nose-rings.tsx";
import { ProductDetailPage } from "./lumicea-react/pages/products/Detail.tsx";

// Admin Pages
import { AdminDashboard } from "./lumicea-react/pages/admin/dashboard/Dashboard.tsx";
import { AdminProductsPage } from "./lumicea-react/pages/admin/products/Products.tsx";
import { AdminOrdersPage } from "./lumicea-react/pages/admin/orders/Orders.tsx";
import { AdminCustomersPage } from "./lumicea-react/pages/admin/customers/Customers.tsx";
import { AdminPagesPage } from "./lumicea-react/pages/admin/pages/Pages.tsx";
import { AdminBlogPage } from "./lumicea-react/pages/admin/blog/Blog.tsx";

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