import { checkAuth, defaultHandler } from '@/app/api/server';
import { createInvoice } from '@/db/invoices';
import { Invoice } from '@/db/types';
import { NextResponse } from 'next/server';

async function handler(request: Request) {
  const forbidden = await checkAuth();
  if (forbidden) return forbidden;
  const body: Partial<Invoice> = await request.json();
  const success = await createInvoice(body).catch((e) => {
    console.error(e);
    return false;
  });
  return NextResponse.json({ success });
}

export { handler as POST, defaultHandler as GET };
