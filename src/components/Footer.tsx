'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Car, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';

interface FooterItem {
  name: string;
  href: string;
  external?: boolean;
}

interface FooterMenu {
  title: string;
  items: FooterItem[];
}

const footerMenus: FooterMenu[] = [
  {
    title: 'footer.autoOrder.title',
    items: [
      { name: 'footer.autoOrder.about', href: '/about' },
      { name: 'footer.autoOrder.team', href: '/team' },
      { name: 'footer.autoOrder.careers', href: '/careers' },
      { name: 'footer.autoOrder.partners', href: '/partners' },
    ],
  },
  {
    title: 'footer.help.title',
    items: [
      { name: 'footer.help.faq', href: '/faq' },
      { name: 'footer.help.support', href: '/support' },
      { name: 'footer.help.documentation', href: '/docs' },
      { name: 'footer.help.tutorials', href: '/tutorials' },
    ],
  },
  {
    title: 'footer.legal.title',
    items: [
      { name: 'footer.legal.privacy', href: '/privacy' },
      { name: 'footer.legal.terms', href: '/terms' },
      { name: 'footer.legal.cookies', href: '/cookies' },
      { name: 'footer.legal.gdpr', href: '/gdpr' },
    ],
  },
  {
    title: 'footer.contact.title',
    items: [
      { name: 'footer.contact.email', href: 'mailto:contact@autoorder.ro', external: true },
      { name: 'footer.contact.phone', href: 'tel:+40123456789', external: true },
      { name: 'footer.contact.address', href: '/contact', external: false },
      { name: 'footer.contact.schedule', href: '/contact', external: false },
    ],
  },
];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">AutoOrder</div>
                  <div className="text-sm text-muted-foreground">Mașini la comandă</div>
                </div>
              </div>
              
              <p className="text-muted-foreground max-w-md">
                {t('footer.description')}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>contact@autoorder.ro</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+40 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>București, România</span>
                </div>
              </div>
            </div>

            {/* Footer Menus */}
            {footerMenus.map((menu, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold text-foreground">
                  {t(menu.title)}
                </h3>
                <ul className="space-y-2">
                  {menu.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.external ? (
                        <a
                          href={item.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t(item.name)}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {t(item.name)}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Newsletter & CTA */}
        <div className="py-8">
          <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {t('footer.newsletter.title')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('footer.newsletter.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button asChild size="lg">
                  <Link href="/contact?type=offer">
                    {t('footer.newsletter.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Badge variant="outline" className="text-sm">
                  {t('footer.newsletter.badge')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 AutoOrder. {t('footer.copyright')}
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                {t('footer.bottom.privacy')}
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                {t('footer.bottom.terms')}
              </Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">
                {t('footer.bottom.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
