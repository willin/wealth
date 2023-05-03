import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth/next';
import { AdminId, AdminType, ApiToken } from '@/lib/config';
import { headers } from 'next/headers';

export async function checkAuth() {
  // Bearer Token Check, only when enabled
  if (ApiToken) {
    const headersList = headers();
    const authorization = headersList.get('authorization');
    if (authorization) {
      if (authorization !== `Bearer ${ApiToken}`) return NextResponse.json({ status: 0 }, { status: 401 });
      return;
    }
  }
  // Session Check
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ status: 0 }, { status: 401 });
  if ((session.user as { [k: string]: string })?.[AdminType] !== AdminId)
    return NextResponse.json({ status: 0 }, { status: 403 });
}

export function defaultHandler() {
  return NextResponse.json({ status: 404 }, { status: 404 });
}

export function catchServerError<T = any>(defaultValue: T) {
  return (e: Error) => {
    console.error(e);
    return defaultValue;
  };
}

export type ApiContextParams = { params: { [k: string]: string } };
