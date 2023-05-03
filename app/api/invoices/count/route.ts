import { checkAuth, defaultHandler } from '@/app/api/server';
import { countInvoices } from '@/db/invoices';
import { Invoice } from '@/db/types';
import { NextResponse } from 'next/server';

async function countHandler(request: Request) {
  const forbidden = await checkAuth();
  if (forbidden) return forbidden;
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries()) as any as Partial<Invoice>;
  const data = await countInvoices(query);
  return NextResponse.json({ data });
}

export { countHandler as GET, defaultHandler as POST };
