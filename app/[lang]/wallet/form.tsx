'use client';
import { Invoice } from '@/db/types';
import { BaseURL } from '@/lib/config';
import useSWR from 'swr';

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  const data: JSON = await res.json();
  return data;
}

export function CreateForm({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}

      <h1>h1</h1>
      <h2>h2</h2>
    </div>
  );
}

export function UpdateForm({ id, children }: { id: number; children: React.ReactNode }) {
  const { data } = useSWR<{ data: Invoice }>(`${BaseURL}/api/invoices/${id}`, fetcher);

  return (
    <div>
      {children}
      <h1>h1</h1>
      <h2>h2</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function form({ id }: { id?: number }) {
  const Form = id ? UpdateForm : CreateForm;
  return (
    <Form id={id!}>
      <h1>test</h1>
      <h2>test</h2>
    </Form>
  );
}
