import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(request: Request) {
  try {
    const { id, data } = await request.json()
    const { error } = await supabaseAdmin.from('places').update(data).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const { error } = await supabaseAdmin
      .from('places')
      .update({ status: 'closed' })
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
