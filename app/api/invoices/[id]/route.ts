import { type ContextParams, checkAuth } from '@/app/api/server';
import { updateInvoice, getInvoice } from '@/db/invoices';
import { Invoice } from '@/db/types';
import { NextResponse } from 'next/server';

async function getHandler(request: Request, { params: { id } }: ContextParams) {
  const forbidden = await checkAuth();
  if (forbidden) return forbidden;
  const result = await getInvoice({
    id: +id
  });
  if (!result) return NextResponse.json({ status: 404 }, { status: 404 });
  return NextResponse.json(result);
}

async function updateHandler(request: Request, { params: { id } }: ContextParams) {
  const forbidden = await checkAuth();
  if (forbidden) return forbidden;
  const body: Partial<Invoice> = await request.json();
  const success = await updateInvoice({
    ...body,
    id: +id
  }).catch((e) => {
    console.error(e);
    return false;
  });
  return NextResponse.json({ success });
}

async function deleteHandler(request: Request, { params: { id } }: ContextParams) {
  const forbidden = await checkAuth();
  if (forbidden) return forbidden;
  const success = await updateInvoice({
    id: +id,
    amount: 0
  });
  return NextResponse.json({ success });
}

export { updateHandler as POST, updateHandler as PUT, deleteHandler as DELETE, getHandler as GET };
