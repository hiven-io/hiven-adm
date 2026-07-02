import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const { error } = await supabaseAdmin
      .from('posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
