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

// Define the Tag type for state
interface Tag {
  id: string;
  name: string;
}

export function TagPage() {
    const [tag, setTag] = useState<Tag | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { slug } = useParams<{ slug: string }>(); // Get the slug from the URL

    useEffect(() => {
        async function fetchTagAndProducts() {
            if (!slug) {
                setLoading(false);
                setError(true);
                return;
            }

            setLoading(true);
            setError(false);
            setProducts([]);
            setTag(null);

            // 1. Fetch the tag by its slug from the 'tags' table
            const { data: tagData, error: tagError } = await supabase
                .from('tags')
                .select('id, name')
                .eq('slug', slug)
                .single();

            if (tagError || !tagData) {
                console.error("Error fetching tag:", tagError?.message);
                setLoading(false);
                setError(true); // Tag not found
                return;
            }

            setTag(tagData);
            const tagId = tagData.id;

            // 2. Fetch all product_id's from the 'product_tags' join table
            const { data: productLinks, error: linksError } = await supabase
                .from('product_tags')
                .select('product_id')
                .eq('tag_id', tagId);

            if (linksError) {
                console.error("Error fetching product links:", linksError.message);
                setLoading(false);
                return;
            }

            const productIds = productLinks.map(link => link.product_id);

            if (productIds.length === 0) {
                // No products for this tag, but the tag exists
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

        fetchTagAndProducts();
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
    
    if (error || !tag) {
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
                            {/* You could create a /tags page that lists all tags, but for now this is fine */}
                            <span className="text-gray-500">Tags</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {/* Use the dynamically fetched tag name */}
                            <span className="text-gray-900 font-medium">{tag.name}</span>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Products tagged "{tag.name}"</h1>
                </div>

                {products.length > 0 ? (
                    <ProductGrid products={products} />
                ) : (
                    <div className="text-center text-gray-500 py-10">No products found with this tag.</div>
                )}
            </main>
            <Footer />
        </div>
    );
}
