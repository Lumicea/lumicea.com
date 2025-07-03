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
  Calendar,
  Tag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BlogEditor } from '@/components/admin/blog-editor';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    setEditingPost(id);
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleBack = () => {
    setEditingPost(null);
    setIsCreating(false);
    loadPosts();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post. Please try again.');
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // If editing or creating, show the editor
  if (editingPost || isCreating) {
    return (
      <BlogEditor 
        postId={editingPost || undefined} 
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
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        <Button onClick={handleCreate} className="lumicea-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-500">/blog/{post.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.category ? (
                          <Badge variant="outline">{post.category}</Badge>
                        ) : (
                          <span className="text-gray-500">Uncategorized</span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>{post.tags.slice(0, 2).join(', ')}{post.tags.length > 2 ? '...' : ''}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {post.is_published && post.published_at
                              ? new Date(post.published_at).toLocaleDateString()
                              : new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(post.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          {deleteConfirmId === post.id ? (
                            <div className="flex space-x-1">
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDelete(post.id)}
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
                              onClick={() => setDeleteConfirmId(post.id)}
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
              <h3 className="text-lg font-medium text-gray-900 mb-1">No blog posts found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first blog post'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate} className="lumicea-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminBlogPage;