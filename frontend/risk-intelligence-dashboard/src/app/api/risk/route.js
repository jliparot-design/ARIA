import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

// forces a page or route handler to render fresh on every single request rather than caching it
export const dynamic = 'force-dynamic'; 
export const revalidate = 0; 

// api to fetch risk entries from supabase
export async function GET() {
  const { data, error } = await supabaseServer
    .from('risk_entries')
    .select('*')
    .order('risk_score', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

