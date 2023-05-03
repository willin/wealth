'use client';
import { InvoiceType } from '@/db/types';
import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function FilterType({ type, tAll, tIn, tOut }: { type: InvoiceType; [k: string]: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams() as any;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams as Record<string, string>);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const changeFilter = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as unknown as { [k: string]: string };
    location.href = pathname + '?' + createQueryString(target.name, target.value);
  };

  return (
    <select defaultValue={type} className='select w-full my-3' name='type' onChange={changeFilter}>
      <option value=''>{tAll}</option>
      <option value={InvoiceType.IN}>{tIn}</option>
      <option value={InvoiceType.OUT}>{tOut}</option>
    </select>
  );
}
