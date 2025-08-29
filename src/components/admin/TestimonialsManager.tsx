'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CloudinaryUploader } from './CloudinaryUploader';
import { Testimonial, CreateTestimonial, UpdateTestimonial, CreateTestimonialSchema } from '@/schemas/testimonials';
import { 
  getTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  updateTestimonialOrder,
  toggleTestimonialFeatured
} from '@/app/admin/settings/testimonials-actions';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff, 
  GripVertical,
  Save,
  X
} from 'lucide-react';

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateTestimonial>({
    resolver: zodResolver(CreateTestimonialSchema),
    defaultValues: {
      name: '',
      role: '',
      avatar_url: '',
      rating: 5,
      content: '',
      is_featured: false,
      order_index: 0,
    },
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast({
        title: 'Error',
        description: 'Failed to load testimonials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateTestimonial) => {
    setIsSubmitting(true);
    try {
      const result = await createTestimonial(data);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Testimonial created successfully',
        });
        setIsCreateDialogOpen(false);
        form.reset();
        loadTestimonials();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create testimonial',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateTestimonial) => {
    if (!editingTestimonial?.id) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateTestimonial(editingTestimonial.id, data);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Testimonial updated successfully',
        });
        setIsEditDialogOpen(false);
        setEditingTestimonial(null);
        loadTestimonials();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update testimonial',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const result = await deleteTestimonial(id);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Testimonial deleted successfully',
        });
        loadTestimonials();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete testimonial',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const result = await toggleTestimonialFeatured(id, isFeatured);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Testimonial ${isFeatured ? 'marked as' : 'unmarked from'} featured`,
        });
        loadTestimonials();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update featured status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newTestimonials = [...testimonials];
    const [movedItem] = newTestimonials.splice(fromIndex, 1);
    newTestimonials.splice(toIndex, 0, movedItem);
    
    // Update order_index for all items
    const updates = newTestimonials.map((item, index) => ({
      id: item.id!,
      order_index: index,
    }));
    
    try {
      const result = await updateTestimonialOrder(updates);
      if (result.success) {
        setTestimonials(newTestimonials);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update order',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    form.reset({
      name: testimonial.name,
      role: testimonial.role || '',
      avatar_url: testimonial.avatar_url || '',
      rating: testimonial.rating || 5,
      content: testimonial.content,
      is_featured: testimonial.is_featured,
      order_index: testimonial.order_index,
    });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Testimoniale ({testimonials.length})</h2>
          <p className="text-sm text-gray-600">Drag and drop to reorder testimonials</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adaugă Testimonial Nou</DialogTitle>
              <DialogDescription>
                Completează informațiile pentru testimonialul nou
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Autor *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Numele autorului"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Input
                    id="role"
                    {...form.register('role')}
                    placeholder="Rolul/autoritatea"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Conținut *</Label>
                <Textarea
                  id="content"
                  {...form.register('content')}
                  placeholder="Testimonialul..."
                  rows={4}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    {...form.register('rating', { valueAsNumber: true })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={form.watch('is_featured')}
                    onCheckedChange={(checked) => form.setValue('is_featured', checked)}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>

              <CloudinaryUploader
                label="Avatar"
                currentImage={form.watch('avatar_url')}
                onUpload={(url) => form.setValue('avatar_url', url)}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Anulează
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvează...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvează
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials List */}
      <div className="space-y-3">
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Drag Handle */}
                <div className="flex-shrink-0 cursor-move" title="Drag to reorder">
                  <GripVertical className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 font-medium text-sm">
                        {(testimonial.name && testimonial.name.charAt(0))?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    {testimonial.role && (
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.role}
                      </Badge>
                    )}
                    {testimonial.is_featured && (
                      <Badge variant="default" className="text-xs bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                    {testimonial.rating && (
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{testimonial.content}</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                    <span>Order: {testimonial.order_index}</span>
                    <span>•</span>
                    <span>Created: {new Date(testimonial.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(testimonial.id!, !testimonial.is_featured)}
                    title={testimonial.is_featured ? 'Unmark as featured' : 'Mark as featured'}
                  >
                    {testimonial.is_featured ? (
                      <StarOff className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Star className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(testimonial)}
                    title="Edit testimonial"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id!)}
                    title="Delete testimonial"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {testimonials.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No testimonials yet. Create your first one!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editează Testimonial</DialogTitle>
            <DialogDescription>
              Modifică informațiile testimonialului
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Autor *</Label>
                <Input
                  id="edit-name"
                  {...form.register('name')}
                  placeholder="Numele autorului"
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Rol</Label>
                <Input
                  id="edit-role"
                  {...form.register('role')}
                  placeholder="Rolul/autoritatea"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-content">Conținut *</Label>
              <Textarea
                id="edit-content"
                {...form.register('content')}
                placeholder="Testimonialul..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-rating">Rating</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  min="1"
                  max="5"
                  {...form.register('rating', { valueAsNumber: true })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_featured"
                  checked={form.watch('is_featured')}
                  onCheckedChange={(checked) => form.setValue('is_featured', checked)}
                />
                <Label htmlFor="edit-is_featured">Featured</Label>
              </div>
            </div>

            <CloudinaryUploader
              label="Avatar"
              currentImage={form.watch('avatar_url')}
              onUpload={(url) => form.setValue('avatar_url', url)}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Anulează
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvează...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvează
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
