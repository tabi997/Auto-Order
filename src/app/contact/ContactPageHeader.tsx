'use client';

import { MapPin, MessageSquare, Clock, Users } from 'lucide-react';
import { usePageContent } from '@/hooks/usePageContent';

export function ContactPageHeader() {
  const { getContent } = usePageContent({ pageId: 'contact' });

  // Use dynamic content with fallback to hardcoded content
  const pageHeader = getContent('header', 'Să discutăm despre mașina ta');
  const pageDescription = getContent('description', 'Suntem aici să te ajutăm să găsești mașina perfectă din licitații B2B. Răspundem în maxim 2 ore în timpul programului de lucru.');

  return (
    <div className="text-center mb-16">
      {/* Background gradient și pattern */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="relative py-12 px-6">
          {/* Badge cu animație */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary text-sm font-semibold mb-8 animate-fade-in-up">
            <MapPin className="h-4 w-4" />
            Contact direct
          </div>
          
          {/* Main heading cu animație */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
            {pageHeader}
          </h1>
          
          {/* Subtitle cu highlight */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
            {pageDescription}
          </p>
          
          {/* Trust indicators cu iconițe animate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: MessageSquare, text: 'Răspuns în 2 ore', color: 'from-blue-500 to-blue-600' },
              { icon: Users, text: 'Suport personalizat', color: 'from-green-500 to-green-600' },
              { icon: Clock, text: 'Program flexibil', color: 'from-purple-500 to-purple-600' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-sm font-medium text-foreground">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
