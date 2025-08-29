// Optimizează bundle-ul pentru a reduce flash-ul de conținut
export const bundleOptimizer = {
  // Preload-ul componentelor critice
  preloadCriticalComponents: () => {
    if (typeof window !== 'undefined') {
      // Preload Hero component
      const heroLink = document.createElement('link')
      heroLink.rel = 'preload'
      heroLink.as = 'script'
      heroLink.href = '/_next/static/chunks/pages/index.js'
      document.head.appendChild(heroLink)
    }
  },

  // Lazy loading pentru componentele non-critice
  lazyLoadNonCritical: () => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            if (target.dataset.lazyLoad) {
              // Load component when it becomes visible
              target.classList.add('loaded')
              observer.unobserve(target)
            }
          }
        })
      })

      // Observe elements with lazy-load attribute
      document.querySelectorAll('[data-lazy-load]').forEach((el) => {
        observer.observe(el)
      })
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

  // Optimizează imagini
  optimizeImages: () => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('lazy')
              imageObserver.unobserve(img)
            }
          }
        })
      })

      // Observe lazy images
      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img)
      })
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
    bundleOptimizer.preloadCriticalComponents()
    bundleOptimizer.optimizeFonts()
    
    // Delay non-critical optimizations
    setTimeout(() => {
      bundleOptimizer.lazyLoadNonCritical()
      bundleOptimizer.optimizeImages()
      bundleOptimizer.optimizeCSS()
      bundleOptimizer.optimizeJavaScript()
    }, 100)
  }
}

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bundleOptimizer.init)
  } else {
    bundleOptimizer.init()
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  (window as any).bundleOptimizer = bundleOptimizer
}
