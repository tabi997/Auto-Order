import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getLeads } from '@/app/actions/leads'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin leads API called')
    
    const user = await requireAdmin()
    console.log('✅ Admin user authenticated:', user?.id)
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    
    console.log('📋 Fetching leads with params:', { page, limit, status, search })
    
    const result = await getLeads({
      page,
      limit,
      status,
      search
    })
    
    console.log('📊 Leads result:', { 
      count: result.data?.length || 0, 
      total: result.total,
      pages: result.pages 
    })
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    )
  }
}
