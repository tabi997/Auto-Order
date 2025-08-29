'use client';

import { useSettings, ContactInfo } from '@/hooks/useSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Phone, Mail, Globe, Building, Facebook, Instagram, Linkedin, Youtube, Loader2, Users, Shield, Zap } from 'lucide-react';

// Default contact information as fallback
const defaultContactInfo: ContactInfo = {
  company: {
    name: 'AutoOrder',
    description: 'Soluția ta pentru sourcing auto profesional și transparent',
    website: 'https://autoorder.ro'
  },
  contact: {
    email: 'contact@autoorder.ro',
    phone: '+40 123 456 789',
    address: 'Strada Exemplu, Nr. 123',
    city: 'București',
    postalCode: '010000',
    country: 'România'
  },
  schedule: {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 18:00',
    saturday: '10:00 - 16:00',
    sunday: 'Închis'
  },
  social: {
    facebook: 'https://facebook.com/autoorder',
    instagram: 'https://instagram.com/autoorder',
    linkedin: 'https://linkedin.com/company/autoorder',
    youtube: 'https://youtube.com/@autoorder'
  }
};

const dayLabels: Record<string, string> = {
  monday: 'Luni',
  tuesday: 'Marți',
  wednesday: 'Miercuri',
  thursday: 'Joi',
  friday: 'Vineri',
  saturday: 'Sâmbătă',
  sunday: 'Duminică'
};

const socialIcons: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube
};

export function ContactInfoDisplay() {
  const { settings, loading } = useSettings();
  
  const contactInfo: ContactInfo = settings?.contact_info || defaultContactInfo;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Se încarcă informațiile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Company Information */}
      <div className="relative">
        {/* Background gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-white/80 via-white/90 to-white/95 dark:from-gray-900/80 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Despre {contactInfo.company.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {contactInfo.company.description}
            </p>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <Globe className="h-4 w-4 text-primary" />
              <a 
                href={contactInfo.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {contactInfo.company.website}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Contact Information */}
      <div className="relative">
        {/* Background gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-white/80 via-white/90 to-white/95 dark:from-gray-900/80 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Informații contact
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-muted-foreground font-medium">Email</p>
                <a 
                  href={`mailto:${contactInfo.contact.email}`}
                  className="font-semibold text-green-700 dark:text-green-300 hover:underline"
                >
                  {contactInfo.contact.email}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground font-medium">Telefon</p>
                <a 
                  href={`tel:${contactInfo.contact.phone}`}
                  className="font-semibold text-blue-700 dark:text-blue-300 hover:underline"
                >
                  {contactInfo.contact.phone}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm text-muted-foreground font-medium">Adresă</p>
                <p className="font-semibold text-purple-700 dark:text-purple-300">
                  {contactInfo.contact.address}, {contactInfo.contact.city}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contactInfo.contact.postalCode}, {contactInfo.contact.country}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Operating Hours */}
      <div className="relative">
        {/* Background gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-white/80 via-white/90 to-white/95 dark:from-gray-900/80 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Program de funcționare
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                <div key={day} className="flex justify-between items-center py-3 px-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors border-b border-orange-200/50 dark:border-orange-800/50 last:border-b-0">
                  <span className="font-semibold capitalize text-foreground">
                    {dayLabels[day]}
                  </span>
                  <span className={`font-medium ${contactInfo.schedule[day] === 'Închis' ? 'text-muted-foreground' : 'text-orange-700 dark:text-orange-300'}`}>
                    {contactInfo.schedule[day]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Social Media */}
      <div className="relative">
        {/* Background gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-white/80 via-white/90 to-white/95 dark:from-gray-900/80 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Rețele sociale
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(contactInfo.social).map(([platform, url]) => {
                if (!url) return null;
                
                const IconComponent = socialIcons[platform];
                const platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1);
                
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-300 border border-purple-200 dark:border-purple-800 group hover:scale-105"
                  >
                    <IconComponent className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300" />
                    <span className="font-semibold text-foreground">{platformLabel}</span>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Response Time Promise */}
      <div className="relative">
        {/* Background gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-2xl mb-3 text-foreground">Răspuns rapid garantat</h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Ne angajăm să răspundem în maxim 2 ore în timpul programului de lucru
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Map Placeholder */}
      <div className="relative">
        {/* Background gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-white/80 via-white/90 to-white/95 dark:from-gray-900/80 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Locația noastră
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-lg font-medium mb-2">Hartă va fi afișată aici</p>
                <p className="text-sm">
                  {contactInfo.contact.address}, {contactInfo.contact.city}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
