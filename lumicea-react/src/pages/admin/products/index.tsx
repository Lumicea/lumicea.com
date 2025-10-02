import React from 'react';
import { AdminProductsListPage } from './list';
import { ProductEditor } from './editor';
import { useParams } from 'react-router-dom';

/**
 * AdminProductsPage is the main controller for the product admin section.
 * It uses the URL to determine whether to show the list or the editor.
 */
export function AdminProductsPage() {
  const { id } = useParams<{ id: string }>();

  // Check if the current URL path indicates creating a new product
  const isCreating = window.location.pathname.endsWith('/admin/products/new');
  
  // If there's an ID in the URL (editing) or if we are on the 'new' path (creating), show the editor.
  if (id || isCreating) {
    return <ProductEditor />;
  }

  // Otherwise, show the product list.
  return <AdminProductsListPage />;
}
