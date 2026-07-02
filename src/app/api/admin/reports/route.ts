import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || '1')
    const status = searchParams.get('status') || ''
    const limit = 20

    let query = supabaseAdmin
      .from('reports')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)

    const { data: reportsData, count, error } = await query
    if (error) throw error

    const reports = (reportsData || []) as any[]
    if (reports.length === 0) return NextResponse.json({ data: [], count: count || 0 })

    const reporterIds = [...new Set(reports.map((r: any) => r.reporter_id).filter(Boolean))]
    let reportersMap: Record<string, any> = {}

    if (reporterIds.length > 0) {
      const { data: reporters } = await supabaseAdmin
        .from('users')
        .select('id, display_name, avatar_url, username')
        .in('id', reporterIds)

      if (reporters) {
        reportersMap = Object.fromEntries(reporters.map((u: any) => [u.id, u]))
      }
    }

    const enriched = reports.map((r: any) => ({
      ...r,
      reporter: reportersMap[r.reporter_id] || null,
    }))

    return NextResponse.json({ data: enriched, count: count || 0 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, data } = await request.json()
    const { error } = await supabaseAdmin.from('reports').update(data).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
