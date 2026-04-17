import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const payload = await request.json();
  const email = String(payload.email || '').toLowerCase();
  const password = String(payload.password || '');
  const name = String(payload.name || '');

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, name, password: hashedPassword } });
  const token = signToken({ userId: user.id, email: user.email });

  return NextResponse.json({ token });
}
