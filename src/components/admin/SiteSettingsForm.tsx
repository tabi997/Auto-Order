'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CloudinaryUploader } from './CloudinaryUploader';
import { SiteSettings, SiteSettingsSchema, DEFAULT_SETTINGS } from '@/schemas/siteSettings';
import { getSiteSettings, saveSiteSettings } from '@/app/admin/settings/actions';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, RotateCcw, Eye, Settings } from 'lucide-react';

export function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const form = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: DEFAULT_SETTINGS,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSettings(data);
        form.reset(data);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form, toast]);

  const onSubmit = async (data: SiteSettings) => {
    setIsSaving(true);
    try {
      const result = await saveSiteSettings(data);
      if (result.success) {
        setSettings(data);
        toast({
          title: 'Success',
          description: 'Settings saved successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save settings',
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
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    form.reset(settings);
  };

  const handleImageUpload = (field: keyof SiteSettings, subfield: string, url: string) => {
    const newSettings = { ...form.getValues() };
    if (newSettings[field] && typeof newSettings[field] === 'object') {
      (newSettings[field] as any)[subfield] = url;
      form.setValue(field as any, newSettings[field] as any);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Configurare</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            </TabsList>

            {/* Hero Tab */}
            <TabsContent value="hero" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Configurează secțiunea principală</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero.title">Titlu Principal</Label>
                    <Input
                      id="hero.title"
                      {...form.register('hero.title')}
                      placeholder="Titlu hero"
                    />
                    {form.formState.errors.hero?.title && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.hero.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="hero.subtitle">Subtitlu</Label>
                    <Textarea
                      id="hero.subtitle"
                      {...form.register('hero.subtitle')}
                      placeholder="Subtitlu hero"
                      rows={3}
                    />
                    {form.formState.errors.hero?.subtitle && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.hero.subtitle.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hero.ctaLabel">Text Buton CTA</Label>
                      <Input
                        id="hero.ctaLabel"
                        {...form.register('hero.ctaLabel')}
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero.ctaHref">Link Buton CTA</Label>
                      <Input
                        id="hero.ctaHref"
                        {...form.register('hero.ctaHref')}
                        placeholder="/contact"
                      />
                    </div>
                  </div>

                  <CloudinaryUploader
                    label="Imagine Hero"
                    currentImage={form.watch('hero.heroImage')}
                    onUpload={(url) => handleImageUpload('hero', 'heroImage', url)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Header Tab */}
            <TabsContent value="header" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Header</CardTitle>
                  <CardDescription>Configurează header-ul site-ului</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="header.headline">Headline</Label>
                    <Input
                      id="header.headline"
                      {...form.register('header.headline')}
                      placeholder="Auto Order"
                    />
                  </div>
                  <div>
                    <Label htmlFor="header.subheadline">Subheadline</Label>
                    <Input
                      id="header.subheadline"
                      {...form.register('header.subheadline')}
                      placeholder="Professional Vehicle Sourcing"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                  <CardDescription>Configurează meta tag-urile SEO</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seo.title">Titlu SEO</Label>
                    <Input
                      id="seo.title"
                      {...form.register('seo.title')}
                      placeholder="Titlu pentru SEO"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo.description">Descriere SEO</Label>
                    <Textarea
                      id="seo.description"
                      {...form.register('seo.description')}
                      placeholder="Descriere pentru SEO"
                      rows={3}
                    />
                  </div>
                  <CloudinaryUploader
                    label="Imagine Open Graph"
                    currentImage={form.watch('seo.ogImage')}
                    onUpload={(url) => handleImageUpload('seo', 'ogImage', url)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informații Contact</CardTitle>
                  <CardDescription>Configurează informațiile de contact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact.phone">Telefon</Label>
                      <Input
                        id="contact.phone"
                        {...form.register('contact.phone')}
                        placeholder="+44 123 456 789"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact.email">Email</Label>
                      <Input
                        id="contact.email"
                        {...form.register('contact.email')}
                        type="email"
                        placeholder="info@autoorder.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact.address">Adresă</Label>
                    <Textarea
                      id="contact.address"
                      {...form.register('contact.address')}
                      placeholder="Adresa completă"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact.schedule">Program</Label>
                    <Input
                      id="contact.schedule"
                      {...form.register('contact.schedule')}
                      placeholder="Mon-Fri: 9AM-6PM"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter Tab */}
            <TabsContent value="newsletter" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter</CardTitle>
                  <CardDescription>Configurează newsletter-ul</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="newsletter.enabled"
                      checked={form.watch('newsletter.enabled')}
                      onCheckedChange={(checked) => form.setValue('newsletter.enabled', checked)}
                    />
                    <Label htmlFor="newsletter.enabled">Newsletter activat</Label>
                  </div>
                  <div>
                    <Label htmlFor="newsletter.provider">Provider</Label>
                    <Input
                      id="newsletter.provider"
                      {...form.register('newsletter.provider')}
                      placeholder="mailchimp"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
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
      </div>

      {/* Preview Section */}
      {previewMode && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Preview Live</h2>
          </div>
          
          <div className="space-y-6">
            {/* Hero Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hero Section</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  {form.watch('hero.heroImage') && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={form.watch('hero.heroImage')}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900">
                    {form.watch('hero.title') || 'Titlu Hero'}
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {form.watch('hero.subtitle') || 'Subtitlu hero'}
                  </p>
                  <Button className="px-6 py-2">
                    {form.watch('hero.ctaLabel') || 'Get Started'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Header Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Header</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {form.watch('header.headline') || 'Auto Order'}
                  </h1>
                  <p className="text-gray-600">
                    {form.watch('header.subheadline') || 'Professional Vehicle Sourcing'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Phone:</strong> {form.watch('contact.phone') || 'N/A'}</p>
                  <p><strong>Email:</strong> {form.watch('contact.email') || 'N/A'}</p>
                  <p><strong>Address:</strong> {form.watch('contact.address') || 'N/A'}</p>
                  <p><strong>Schedule:</strong> {form.watch('contact.schedule') || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
