'use client';
import clsx from 'classnames';
import { Pagination } from '@/db/types';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function Paginator({ count, params: { limit: l, page: p } }: { count: number; params: Pagination }) {
  const pathname = usePathname();
  const searchParams = useSearchParams() as any;

  const page = +p || 1;
  const limit = +l || 20;
  const pages = Math.ceil(count / limit);

  const createQueryString = useCallback(
    (list: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams as Record<string, string>);
      list.forEach(({ name, value }) => {
        params.set(name, value);
      });
      return params.toString();
    },
    [searchParams]
  );

  function goto(to: number) {
    location.href = pathname + '?' + createQueryString([{ name: 'page', value: `${to}` }]);
  }
  function changeLimit(e: React.ChangeEvent<HTMLElement>) {
    const target = e.target as unknown as { [k: string]: string };
    location.href =
      pathname +
      '?' +
      createQueryString([
        { name: 'page', value: '1' },
        { name: 'limit', value: target.value }
      ]);
  }

  return (
    <div className='btn-group w-full mt-4 justify-center bg-neutral'>
      <button className='btn' disabled={page === 1} onClick={() => goto(page - 1)}>
        «
      </button>
      <button className='btn btn-disabled'>
        {page} / {pages}
      </button>
      <select className='select' value={l} onChange={changeLimit}>
        <option value='10'>10</option>
        <option value='20'>20</option>
        <option value='50'>50</option>
        <option value='100'>100</option>
      </select>
      <button
        className='btn'
        disabled={page === pages}
        onClick={() => {
          goto(page + 1);
        }}>
        »
      </button>
    </div>
  );
}
