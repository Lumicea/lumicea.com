import React, { useState } from 'react';
import { AdminProductsListPage } from './list';
import { ProductEditor } from './editor';

/**
 * AdminProductsPage is the main controller for the product admin section.
 * It manages the view state to switch between the product list and the product editor.
 */
export function AdminProductsPage() {
  // State to hold the ID of the product being edited. Null for a new product.
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  // State to determine which view to display: 'list' or 'editor'
  const [view, setView] = useState<'list' | 'editor'>('list');

  // Callback to switch to the editor view with a specific product ID
  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
    setView('editor');
  };

  // Callback to switch to the editor view for a new product
  const handleAddProduct = () => {
    setEditingProductId(null);
    setView('editor');
  };

  // Callback to return to the list view, resetting the editing ID
  const handleBackToList = () => {
    setView('list');
    setEditingProductId(null);
  };

  // Render the appropriate component based on the current view state
  if (view === 'editor') {
    return <ProductEditor productId={editingProductId} onBack={handleBackToList} />;
  }

  // Default view is the product list
  return <AdminProductsListPage onAdd={handleAddProduct} onEdit={handleEditProduct} />;
}
