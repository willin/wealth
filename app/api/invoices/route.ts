import { catchServerError, checkAuth } from '@/app/api/server';
import { createInvoice, getInvoices } from '@/db/invoices';
import { Invoice, Pagination } from '@/db/types';
import { NextResponse } from 'next/server';

async function createHandler(request: Request) {
  const forbidden = await checkAuth();
  if (forbidden) return forbidden;
  const body: Partial<Invoice> = await request.json();
  const success = await createInvoice(body).catch(catchServerError(false));
  return NextResponse.json({ success });
}

async function getHandler(request: Request) {
  const forbidden = await checkAuth();
  if (forbidden) return forbidden;
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries()) as any as Partial<Invoice> & Pagination;
  const data = await getInvoices(query);
  return NextResponse.json({ data });
}

export { createHandler as POST, getHandler as GET };
