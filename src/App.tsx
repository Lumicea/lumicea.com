import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import { HomePage } from "./pages/home/Home.tsx"; // Corrected: points to Home.tsx, not index.tsx 
import { NotFoundPage } from "./pages/not-found/NotFound.tsx"; // Corrected: points to NotFound.tsx, not index.tsx 
import { CartPage } from "./pages/cart/index.tsx"; // Appears correct from directory structure 
import { CheckoutPage } from "./pages/checkout/index.tsx"; // Appears correct from directory structure 
import { CheckoutSuccessPage } from "./pages/checkout/success/index.tsx"; // Appears correct from directory structure 
import { AboutPage } from "./pages/about.tsx"; // Appears correct from directory structure [cite: 4]
import { BlogPage } from "./pages/blog.tsx"; // Appears correct from directory structure [cite: 4]
import { ContactPage } from "./pages/contact.tsx"; // Appears correct from directory structure [cite: 4]
import { CustomPage } from "./pages/custom.tsx"; // Appears correct from directory structure [cite: 4]
import { GiftCardsPage } from "./pages/gift-cards.tsx"; // Appears correct from directory structure [cite: 4]
import { CollectionsPage } from "./pages/collections.tsx"; // Appears correct from directory structure [cite: 4]
import { SettingsPage } from "./pages/settings.tsx"; // Appears correct from directory structure [cite: 4]
import { SizeGuidePage } from "./pages/size-guide.tsx"; // Appears correct from directory structure [cite: 4]
import { LoginPage } from "./pages/auth/login.tsx"; // Appears correct from directory structure 
import { SignupPage } from "./pages/auth/signup.tsx"; // Appears correct from directory structure 
import { EarringsPage } from "./pages/categories/earrings.tsx"; // Appears correct from directory structure 
import { NoseRingsPage } from "./pages/categories/nose-rings.tsx"; // Appears correct from directory structure 
import { ProductDetailPage } from "./pages/products/detail.tsx"; // Appears correct from directory structure 

// Admin Pages
import { AdminDashboard } from "./pages/admin/dashboard/index.tsx"; // Appears correct from directory structure 
import { AdminProductsPage } from "./pages/admin/products/index.tsx"; // Appears correct from directory structure 
import { AdminOrdersPage } from "./pages/admin/orders/index.tsx"; // Appears correct from directory structure 
import { AdminCustomersPage } from "./pages/admin/customers/index.tsx"; // Appears correct from directory structure 
import { AdminPagesPage } from "./pages/admin/pages/index.tsx"; // Appears correct from directory structure 
import { AdminBlogPage } from "./pages/admin/blog/index.tsx"; // Appears correct from directory structure 


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