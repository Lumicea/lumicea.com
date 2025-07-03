import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  FileText,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageEditor } from '@/components/admin/page-editor';

interface Page {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    setEditingPage(id);
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleBack = () => {
    setEditingPage(null);
    setIsCreating(false);
    loadPages();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPages(pages.filter(page => page.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Error deleting page. Please try again.');
    }
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If editing or creating, show the editor
  if (editingPage || isCreating) {
    return (
      <PageEditor 
        pageId={editingPage || undefined} 
        onBack={handleBack}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumicea-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600">Manage static pages on your website</p>
        </div>
        <Button onClick={handleCreate} className="lumicea-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPages.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">/pages/{page.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge className={page.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {page.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(page.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          {deleteConfirmId === page.id ? (
                            <div className="flex space-x-1">
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDelete(page.id)}
                              >
                                Confirm
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setDeleteConfirmId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteConfirmId(page.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No pages found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first page'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate} className="lumicea-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Page
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPagesPage;