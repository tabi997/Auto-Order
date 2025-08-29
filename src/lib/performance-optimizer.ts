// Optimizează performanța pentru a reduce flash-ul de conținut
export const performanceOptimizer = {
  // Optimizează hidratarea
  optimizeHydration: () => {
    if (typeof window !== 'undefined') {
      // Reduce flash-ul de conținut
      document.documentElement.classList.add('hydrating')
      
      // Remove hydrating class after hydration
      window.addEventListener('load', () => {
        setTimeout(() => {
          document.documentElement.classList.remove('hydrating')
        }, 100)
      })
    }
  },

  // Optimizează cache-ul
  optimizeCache: () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      // Cache critical resources
      caches.open('critical-resources').then((cache) => {
        cache.addAll([
          '/',
          '/globals.css',
          '/og/autoorder.png'
        ])
      })
    }
  },

  // Optimizează imagini
  optimizeImages: () => {
    if (typeof window !== 'undefined') {
      // Lazy load images
      const images = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src!
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    }
  },

  // Optimizează fonturile
  optimizeFonts: () => {
    if (typeof window !== 'undefined') {
      // Preload critical fonts
      const fontLink = document.createElement('link')
      fontLink.rel = 'preload'
      fontLink.as = 'font'
      fontLink.type = 'font/woff2'
      fontLink.href = '/fonts/inter-var.woff2'
      fontLink.crossOrigin = 'anonymous'
      document.head.appendChild(fontLink)
    }
  },

  // Optimizează CSS-ul
  optimizeCSS: () => {
    if (typeof window !== 'undefined') {
      // Remove unused CSS
      const styleSheets = Array.from(document.styleSheets)
      styleSheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules || sheet.rules)
          rules.forEach((rule) => {
            if (rule instanceof CSSStyleRule) {
              const selector = rule.selectorText
              if (selector && !document.querySelector(selector)) {
                try {
                  sheet.deleteRule(Array.from(sheet.cssRules || sheet.rules).indexOf(rule))
                } catch (e) {
                  // Ignore errors
                }
              }
            }
          })
        } catch (e) {
          // Ignore cross-origin errors
        }
      })
    }
  },

  // Optimizează JavaScript-ul
  optimizeJavaScript: () => {
    if (typeof window !== 'undefined') {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[data-defer]')
      scripts.forEach((script) => {
        if (script instanceof HTMLScriptElement) {
          script.defer = true
        }
      })
    }
  },

  // Inițializează toate optimizările
  init: () => {
    performanceOptimizer.optimizeHydration()
    performanceOptimizer.optimizeCache()
    performanceOptimizer.optimizeFonts()
    
    // Delay non-critical optimizations
    setTimeout(() => {
      performanceOptimizer.optimizeImages()
      performanceOptimizer.optimizeCSS()
      performanceOptimizer.optimizeJavaScript()
    }, 100)
  }
}

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', performanceOptimizer.init)
  } else {
    performanceOptimizer.init()
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  (window as any).performanceOptimizer = performanceOptimizer
}
