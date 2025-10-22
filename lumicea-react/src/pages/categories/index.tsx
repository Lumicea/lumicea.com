import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase.ts';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductGrid } from '@/components/product/product-grid.tsx';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { NotFoundPage } from '@/pages/not-found/index.tsx';

// Define the Product type for state
interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  images: string[];
  // Add any other fields your ProductGrid component needs
}

// Define the Category type for state
interface Category {
  id: string;
  name: string;
}

export function CategoryPage() {
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { slug } = useParams<{ slug: string }>(); // Get the slug from the URL

    useEffect(() => {
        async function fetchCategoryAndProducts() {
            if (!slug) {
                setLoading(false);
                setError(true);
                return;
            }

            setLoading(true);
            setError(false);
            setProducts([]);
            setCategory(null);

            // 1. Fetch the category by its slug
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('id, name')
                .eq('slug', slug)
                .single();

            if (categoryError || !categoryData) {
                console.error("Error fetching category:", categoryError?.message);
                setLoading(false);
                setError(true); // Category not found
                return;
            }

            setCategory(categoryData);
            const categoryId = categoryData.id;

            // 2. Fetch all product_id's from the join table
            const { data: productLinks, error: linksError } = await supabase
                .from('product_categories')
                .select('product_id')
                .eq('category_id', categoryId);

            if (linksError) {
                console.error("Error fetching product links:", linksError.message);
                setLoading(false);
                return;
            }

            const productIds = productLinks.map(link => link.product_id);

            if (productIds.length === 0) {
                // No products in this category, but the category exists
                setLoading(false);
                return;
            }

            // 3. Fetch all products matching the IDs
            const { data, error } = await supabase
                .from('products')
                .select('id, name, slug, base_price, images, is_active')
                .in('id', productIds)
                .eq('is_active', true);

            if (error) {
                console.error("Error fetching products:", error.message);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        }

        fetchCategoryAndProducts();
    }, [slug]); // Re-run this logic every time the slug changes

    if (loading) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="lumicea-container py-16">
                    <div className="text-center text-gray-500 py-10">Loading products...</div>
                </main>
                <Footer />
            </div>
        );
    }
    
    if (error || !category) {
        // This will render your existing 404 page component
        return <NotFoundPage />;
    }

    return (
        <div className="min-h-screen">
            <Header />
            <main className="lumicea-container py-16">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {/* Use the dynamically fetched category name */}
                            <span className="text-gray-900 font-medium">{category.name}</span>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">{category.name} Collection</h1>
                </div>

                {products.length > 0 ? (
                    <ProductGrid products={products} />
                ) : (
                    <div className="text-center text-gray-500 py-10">No products found in this category.</div>
                )}
            </main>
            <Footer />
        </div>
    );
}
