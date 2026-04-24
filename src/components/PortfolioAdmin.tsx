import { useEffect, useState } from 'react';
import { supabase, type PortfolioItem } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    image_alt: '',
    tags: '',
    featured: false,
    order: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description || null,
      image_url: formData.image_url || null,
      image_alt: formData.image_alt || null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : null,
      featured: formData.featured,
      order: formData.order,
    };

    try {
      if (editing) {
        // Update existing item
        const { error } = await supabase
          .from('portfolio')
          .update(itemData)
          .eq('id', editing);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('portfolio')
          .insert([itemData]);

        if (error) throw error;
      }

      // Reset form and refresh
      resetForm();
      fetchItems();
    } catch (err: any) {
      alert('Error saving item: ' + err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchItems();
    } catch (err: any) {
      alert('Error deleting item: ' + err.message);
    }
  }

  function handleEdit(item: PortfolioItem) {
    setEditing(item.id);
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      image_url: item.image_url || '',
      image_alt: item.image_alt || '',
      tags: item.tags?.join(', ') || '',
      featured: item.featured || false,
      order: item.order || 0,
    });
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      image_alt: '',
      tags: '',
      featured: false,
      order: 0,
    });
    setEditing(null);
    setShowForm(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Portfolio Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio items
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : '+ Add New Item'}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit' : 'Add New'} Portfolio Item</CardTitle>
            <CardDescription>
              Fill in the details below to {editing ? 'update' : 'create'} a portfolio item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="project-slug (auto-generated if empty)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_alt">Image Alt Text</Label>
                  <Input
                    id="image_alt"
                    value={formData.image_alt}
                    onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                    placeholder="Describe the image"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="design, web, branding"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-input"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured (show in Featured Work section)
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {editing ? 'Update' : 'Create'} Item
                </Button>
                {editing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          All Items ({items.length})
        </h2>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No portfolio items yet. Click "Add New Item" to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.image_alt || item.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  {item.featured && (
                    <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded mb-2">
                      Featured
                    </span>
                  )}
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 text-xs bg-muted rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
