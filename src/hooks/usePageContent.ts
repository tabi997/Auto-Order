'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getPageContent, PageContent } from '@/app/actions/admin'

interface UsePageContentOptions {
  pageId?: string
  language?: string
  fallbackToDefaults?: boolean
}

interface ContentMap {
  [key: string]: {
    title: string
    content: string
    subtitle?: string
  }
}

// Cache global pentru a evita refetch-ul la navigare
const contentCache = new Map<string, { content: PageContent[], timestamp: number, map: ContentMap }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minute

export function usePageContent(options: UsePageContentOptions = {}) {
  const { pageId, language = 'ro', fallbackToDefaults = true } = options
  const [content, setContent] = useState<PageContent[]>([])
  const [contentMap, setContentMap] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now())
  const [lastFetch, setLastFetch] = useState<number>(0)

  // Cache key pentru această pagină și limbă
  const cacheKey = useMemo(() => `${pageId}-${language}`, [pageId, language])

  const fetchContent = useCallback(async () => {
    if (!pageId) {
      setLoading(false)
      return
    }

    try {
      // Verifică cache-ul local mai întâi
      const cached = contentCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setContent(cached.content)
        setContentMap(cached.map)
        setLastFetch(cached.timestamp)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      
      const data = await getPageContent(pageId, language)
      setContent(data)
      setLastFetch(Date.now())
      
      // Create a map for easy access
      const map: ContentMap = {}
      data.forEach((item: PageContent) => {
        map[item.section_key] = {
          title: item.title,
          content: item.content,
          subtitle: item.subtitle
        }
      })
      
      setContentMap(map)

      // Salvează în cache
      contentCache.set(cacheKey, {
        content: data,
        timestamp: Date.now(),
        map
      })
    } catch (err: any) {
      console.error('Error fetching page content:', err)
      setError(err.message || 'Failed to fetch content')
      
      if (fallbackToDefaults) {
        // Set empty content map as fallback
        setContentMap({})
      }
    } finally {
      setLoading(false)
    }
  }, [pageId, language, fallbackToDefaults, cacheKey])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const refresh = useCallback(() => {
    // Șterge cache-ul pentru această pagină
    contentCache.delete(cacheKey)
    setRefreshTimestamp(Date.now())
  }, [cacheKey])

  const getContent = (sectionKey: string, fallback?: string) => {
    const section = contentMap[sectionKey]
    if (section) {
      return section.content
    }
    return fallback || ''
  }

  const getTitle = (sectionKey: string, fallback?: string) => {
    const section = contentMap[sectionKey]
    if (section) {
      return section.title
    }
    return fallback || ''
  }

  const getSubtitle = (sectionKey: string, fallback?: string) => {
    const section = contentMap[sectionKey]
    if (section) {
      return section.subtitle
    }
    return fallback || ''
  }

  const getSection = (sectionKey: string) => {
    return contentMap[sectionKey] || null
  }

  return {
    content,
    contentMap,
    loading,
    error,
    getContent,
    getTitle,
    getSubtitle,
    getSection,
    refresh
  }
}
