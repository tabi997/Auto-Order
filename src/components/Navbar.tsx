'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { QuickSearch } from '@/components/QuickSearch'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ValuationModal } from '@/components/ValuationModal'
import { Car, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`sticky top-0 z-40 transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5' 
          : 'bg-background/90 backdrop-blur-md'
      }`}>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex h-16 sm:h-20 items-center justify-between w-full">
            {/* Brand */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
              <div className="relative">
                <Car className="h-7 w-7 sm:h-9 sm:w-9 text-primary transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AutoOrder
              </span>
            </Link>
            
            {/* Center - Quick Search (hidden on mobile) */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8 xl:mx-12">
              <QuickSearch />
            </div>
            
            {/* Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 flex-shrink-0">
              {/* Navigation Links */}
              <div className="flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
                <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105">
                  Home
                </Link>
                <Link href="/stock" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105">
                  Stock
                </Link>
                <Link href="/sourcing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105">
                  Sourcing
                </Link>
                <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105">
                  Contact
                </Link>
              </div>
              
              {/* Divider */}
              <div className="w-px h-6 bg-border/60" />
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsValuationModalOpen(true)}
                  className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 whitespace-nowrap text-xs lg:text-sm px-2 lg:px-3"
                >
                  <span className="hidden xl:inline">Evaluează mașina mea</span>
                  <span className="xl:hidden">Evaluează</span>
                </Button>
                
                <ThemeToggle />
              </div>
            </div>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Mobile Quick Search */}
          <div className="lg:hidden pb-4 sm:pb-6 w-full">
            <QuickSearch />
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl shadow-lg">
            <div className="container max-w-7xl mx-auto px-6 py-6">
              {/* Navigation Links */}
              <div className="space-y-4 mb-6">
                <Link 
                  href="/" 
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2 px-3 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/stock" 
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2 px-3 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Stock
                </Link>
                <Link 
                  href="/sourcing" 
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2 px-3 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sourcing
                </Link>
                <Link 
                  href="/contact" 
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2 px-3 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
              
              {/* Divider */}
              <div className="w-full h-px bg-border/60 mb-6" />
              
              {/* Action Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setIsValuationModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="w-full justify-center border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 py-3"
              >
                Evaluează mașina mea
              </Button>
            </div>
          </div>
        )}
      </nav>
      
      <ValuationModal 
        isOpen={isValuationModalOpen} 
        onClose={() => setIsValuationModalOpen(false)} 
      />
    </>
  )
}
