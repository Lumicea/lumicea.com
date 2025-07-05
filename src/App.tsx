@@ .. @@
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
+// Import ScrollToTop component
+import { ScrollToTop } from '@/components/scroll-to-top';
+
 // Pages
 import { HomePage } from "@/pages/home/index.tsx";
 import { NotFoundPage } from "@/pages/not-found/index.tsx";
@@ .. @@
 function App() {
   return (
     <Router>
+      <ScrollToTop />
       <Routes>
         <Route path="/" element={<HomePage />} />
         <Route path="/cart" element={<CartPage />} />