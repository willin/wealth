'use client';
import { Invoice, InvoiceInCategory, InvoiceMethod, InvoiceOutCategory, InvoiceType } from '@/db/types';
import dayjs from 'dayjs';
import clsx from 'classnames';
import { useEffect, useState } from 'react';

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  const data: JSON = await res.json();
  return data;
}

export default function Form({
  id,
  locale,
  methods,
  types,
  inCategories,
  outCategories
}: {
  id?: number;
  locale: string;
  methods: { [k: string]: string }[];
  types: { [k: string]: string }[];
  inCategories: { [k: string]: string }[];
  outCategories: { [k: string]: string }[];
}) {
  const [item, setItem] = useState<Invoice>({
    type: InvoiceType.IN,
    date: dayjs().format('YYYY-MM-DD'),
    category: InvoiceInCategory[0],
    amount: 0,
    method: InvoiceMethod[0],
    desc: '',
    note: ''
  });
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState(inCategories);
  useEffect(() => {
    if (id) {
      setLoading(true);
      void fetcher(`/api/invoices/${id}`).then(({ data }: { data: Invoice }) => {
        setCategories(data.type === InvoiceType.IN ? inCategories : outCategories);
        setItem(data);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeItemFields = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as unknown as { [k: string]: string };

    if (target.name === 'type') {
      setCategories(target.value === InvoiceType.IN ? inCategories : outCategories);
      setItem({
        ...item,
        type: target.value,
        category: target.value === InvoiceType.IN ? InvoiceInCategory[0] : InvoiceOutCategory[0]
      });
    } else {
      setItem({ ...item, [target.name]: target.value });
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // eslint-disable-next-line no-unused-vars
    const { id: _id, ...body } = item;
    const { success } = await fetcher(`/api/invoices${id ? `/${id}` : ''}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setLoading(false);
    if (success) location.href = `/${locale}/wallet`;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className='indicator w-full my-8'>
        <div className='indicator-item indicator-bottom indicator-center'>
          <button className={clsx('btn btn-primary', { loading: isLoading })}>
            {!isLoading && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='stroke-current flex-shrink-0 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            )}
          </button>
        </div>
        <div className='card border w-full'>
          <div className='card-body'>
            {item.id && (
              <div className='form-control'>
                <label className='input-group'>
                  <span>
                    <svg viewBox='0 0 1024 1024' className='w-4 h-4 fill-current'>
                      <path d='M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136V232h752v560zM610.3 476h123.4c1.3 0 2.3-3.6 2.3-8v-48c0-4.4-1-8-2.3-8H610.3c-1.3 0-2.3 3.6-2.3 8v48c0 4.4 1 8 2.3 8zm4.8 144h185.7c3.9 0 7.1-3.6 7.1-8v-48c0-4.4-3.2-8-7.1-8H615.1c-3.9 0-7.1 3.6-7.1 8v48c0 4.4 3.2 8 7.1 8zM224 673h43.9c4.2 0 7.6-3.3 7.9-7.5 3.8-50.5 46-90.5 97.2-90.5s93.4 40 97.2 90.5c.3 4.2 3.7 7.5 7.9 7.5H522a8 8 0 008-8.4c-2.8-53.3-32-99.7-74.6-126.1a111.8 111.8 0 0029.1-75.5c0-61.9-49.9-112-111.4-112s-111.4 50.1-111.4 112c0 29.1 11 55.5 29.1 75.5a158.09 158.09 0 00-74.6 126.1c-.4 4.6 3.2 8.4 7.8 8.4zm149-262c28.5 0 51.7 23.3 51.7 52s-23.2 52-51.7 52-51.7-23.3-51.7-52 23.2-52 51.7-52z' />
                    </svg>
                  </span>
                  <input name='id' type='text' className='input input-bordered' disabled defaultValue={item.id} />
                </label>
              </div>
            )}
            <div className='form-control'>
              <label className='input-group'>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='w-4 h-4 stroke-current'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'></path>
                  </svg>
                </span>
                <select
                  name='type'
                  className='select select-bordered'
                  value={item.type}
                  onChange={changeItemFields}
                  disabled={isLoading}>
                  {types.map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  name='category'
                  disabled={isLoading}
                  className='select select-bordered'
                  value={item.category}
                  onChange={changeItemFields}>
                  {categories.map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='form-control'>
              <label className='input-group'>
                <span>
                  <svg viewBox='0 0 1024 1024' className='w-4 h-4 fill-current'>
                    <path d='M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v584zM639.5 414h-45c-3 0-5.8 1.7-7.1 4.4L514 563.8h-2.8l-73.4-145.4a8 8 0 00-7.1-4.4h-46c-1.3 0-2.7.3-3.8 1-3.9 2.1-5.3 7-3.2 10.9l89.3 164h-48.6c-4.4 0-8 3.6-8 8v21.3c0 4.4 3.6 8 8 8h65.1v33.7h-65.1c-4.4 0-8 3.6-8 8v21.3c0 4.4 3.6 8 8 8h65.1V752c0 4.4 3.6 8 8 8h41.3c4.4 0 8-3.6 8-8v-53.8h65.4c4.4 0 8-3.6 8-8v-21.3c0-4.4-3.6-8-8-8h-65.4v-33.7h65.4c4.4 0 8-3.6 8-8v-21.3c0-4.4-3.6-8-8-8h-49.1l89.3-164.1c.6-1.2 1-2.5 1-3.8.1-4.4-3.4-8-7.9-8z' />
                  </svg>
                </span>
                <input
                  name='amount'
                  type='number'
                  disabled={isLoading}
                  className='input input-bordered'
                  step='.01'
                  value={item.amount}
                  onChange={changeItemFields}
                />
              </label>
            </div>
            <div className='form-control'>
              <label className='input-group'>
                <span>
                  <svg viewBox='0 0 64 64' className='w-4 h-4 fill-current'>
                    <path fill='none' stroke='currentColor' strokeMiterlimit={10} strokeWidth={2} d='M1 16h62v32H1z' />
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeMiterlimit={10}
                      strokeWidth={2}
                      d='M10 44a5 5 0 00-5-5V25a5 5 0 005-5h44a5 5 0 005 5v14a5 5 0 00-5 5H10z'
                    />
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeMiterlimit={10}
                      strokeWidth={2}
                      d='M40 32 A8 8 0 0 1 32 40 A8 8 0 0 1 24 32 A8 8 0 0 1 40 32 z'
                    />
                  </svg>
                </span>
                <select
                  name='method'
                  disabled={isLoading}
                  className='select select-bordered w-[211px]'
                  value={item.method}
                  onChange={changeItemFields}>
                  {methods.map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className='form-control'>
              <label className='input-group'>
                <span>
                  <svg
                    width='24'
                    height='24'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='w-4 h-4 stroke-current'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'></path>
                  </svg>
                </span>
                <input
                  name='desc'
                  type='text'
                  disabled={isLoading}
                  placeholder='Desc / 项目说明'
                  className='input input-bordered'
                  value={item.desc}
                  onChange={changeItemFields}
                />
              </label>
            </div>
            <div className='form-control'>
              <input
                type='date'
                className={'input input-bordered max-w-[260px]'}
                onChange={(e) => {
                  setItem({ ...item, date: e.target.value });
                }}
                disabled={isLoading}
                value={item.date as string}
              />
            </div>
            <div className='form-control'>
              <textarea
                name='note'
                disabled={isLoading}
                className='textarea max-w-[260px]'
                placeholder='Remark / 备注'
                value={item.note}
                onChange={changeItemFields}></textarea>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
