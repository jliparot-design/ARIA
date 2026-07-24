import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

// api to fetch topics from supabase using the get_topics rpc function
export async function GET() {
  const { data, error } = await supabaseServer.rpc('get_topics');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const topics = data.map(row => row.topic);
  return NextResponse.json(topics);
}