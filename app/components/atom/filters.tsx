import { InvoiceType } from '~/types';
import React, { useCallback } from 'react';
import { useSearchParams } from '@remix-run/react';

export function FilterType({
  type,
  tAll,
  tIn,
  tOut
}: {
  type: InvoiceType;
  [k: string]: string;
}) {
  const [, setSearchParams] = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      if (value) {
        setSearchParams((params) => {
          params.set(name, value);
          return params;
        });
      } else {
        setSearchParams((params) => {
          params.delete(name);
          return params;
        });
      }
    },
    [setSearchParams]
  );

  const changeFilter = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as unknown as { [k: string]: string };
    createQueryString(target.name, target.value);
  };

  return (
    <select
      defaultValue={type}
      className='select w-full my-3'
      name='type'
      onChange={changeFilter}>
      <option value=''>{tAll}</option>
      <option value={InvoiceType.IN}>{tIn}</option>
      <option value={InvoiceType.OUT}>{tOut}</option>
    </select>
  );
}
