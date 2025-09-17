import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase.ts';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card.tsx'; // Ensure this component exists
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function NoseRingsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', 'nose-rings') // Assuming you have a slug for categories
                .single();

            if (categoryError || !categoryData) {
                console.error("Error fetching category:", categoryError);
                setLoading(false);
                return;
            }

            const categoryId = categoryData.id;

            const { data, error } = await supabase
                .from('products')
                .select('*') // You might want to select specific columns for better performance
                .eq('category_id', categoryId)
                .eq('is_active', true); // Only fetch active products

            if (error) {
                console.error("Error fetching products:", error);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        }

        fetchProducts();
    }, []);

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
                            <span className="text-gray-900 font-medium">Nose Rings</span>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Nose Rings</h1>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Loading products...</div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">No products found in this category.</div>
                )}
            </main>
            <Footer />
        </div>
    );
}
