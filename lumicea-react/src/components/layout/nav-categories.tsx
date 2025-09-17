// lumicea-react/src/components/layout/nav-categories.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase.ts';
import { cn } from '@/lib/utils';

interface NavCategoriesProps {
    isScrolled?: boolean;
    isMobile?: boolean;
}

export function NavCategories({ isScrolled, isMobile }: NavCategoriesProps) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('name, slug').order('name');
            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                setCategories(data || []);
            }
            setLoading(false);
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className={cn(
                "flex items-center space-x-6",
                isMobile ? "flex-col items-start space-y-2 space-x-0" : ""
            )}>
                <div className="text-sm text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <nav className={cn(
            "flex items-center space-x-6",
            isMobile ? "flex-col items-start space-y-2 space-x-0" : ""
        )}>
            {categories.map((category) => (
                <Link
                    key={category.slug}
                    to={`/categories/${category.slug}`}
                    className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        isMobile 
                            ? "w-full p-3 rounded-lg hover:bg-lumicea-navy/5 text-gray-900"
                            : isScrolled
                                ? 'text-gray-600 hover:text-lumicea-navy'
                                : 'text-white/90 hover:text-lumicea-gold drop-shadow-sm'
                    )}
                >
                    {category.name}
                </Link>
            ))}
        </nav>
    );
}
