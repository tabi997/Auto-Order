'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X, Car, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useHomeTranslation } from '@/i18n';

const navigation = [
  { name: 'header.nav.home', href: '/' },
  { name: 'header.nav.stock', href: '/stock' },
  { name: 'header.nav.sourcing', href: '/sourcing' },
  { name: 'header.nav.contact', href: '/contact' },
];

export function Header() {
  const { t } = useHomeTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-foreground">AutoOrder</div>
                <div className="text-xs text-muted-foreground">{t('header.brandTagline')}</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* Right side - CTA and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Phone number - hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <a 
                href="tel:+40123456789" 
                className="flex items-center space-x-2 hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Sună la AutoOrder"
              >
                <Phone className="h-4 w-4" />
                <span>{t('header.phoneLabel')}</span>
              </a>
            </div>

            {/* CTA Button */}
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/contact?type=offer" aria-label="Cere ofertă AutoOrder">
                {t('header.cta')}
              </Link>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Deschide meniul mobil"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-2 py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.name)}
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t">
                <Button asChild className="w-full">
                  <Link href="/contact?type=offer" onClick={() => setMobileMenuOpen(false)} aria-label="Cere ofertă AutoOrder">
                    {t('header.cta')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
