// lumicea-react/src/components/layout/nav-categories.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase.ts';

export function NavCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            // Fetch categories from the Supabase 'categories' table
            const { data, error } = await supabase
                .from('categories')
                .select('name, slug')
                .order('name');
            
            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                setCategories(data || []);
            }
            setLoading(false);
        };
        fetchCategories();
    }, []); // Empty dependency array ensures this runs once on mount

    if (loading) {
        return <div className="text-sm text-gray-400">Loading...</div>; 
    }

    return (
        <nav className="flex items-center space-x-6">
            {categories.map((category) => (
                <Link
                    key={category.slug}
                    to={`/categories/${category.slug}`}
                    className="text-sm font-medium text-gray-900 hover:text-lumicea-gold transition-colors"
                >
                    {category.name}
                </Link>
            ))}
        </nav>
    );
}
