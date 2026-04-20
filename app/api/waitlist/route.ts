import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { email, agency_size, source } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from('waitlist').insert({
      email: email.toLowerCase().trim(),
      agency_size: agency_size || null,
      source: source || 'landing',
      created_at: new Date().toISOString(),
    });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Already on the list!' }, { status: 200 });
      }
      console.error('Waitlist insert error:', error);
      return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
    }

    return NextResponse.json({ message: 'success' }, { status: 201 });
  } catch (err) {
    console.error('Waitlist route error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
