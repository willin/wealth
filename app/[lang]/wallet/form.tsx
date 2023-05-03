'use client';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { Invoice, InvoiceInCategory, InvoiceMethod, InvoiceOutCategory, InvoiceType } from '@/db/types';
import { BaseURL } from '@/lib/config';
import dayjs from 'dayjs';
import clsx from 'classnames';
import { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';

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
      void fetcher(`${BaseURL}/api/invoices/${id}`).then(({ data }: { data: Invoice }) => {
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
      setItem({ ...item, type: target.value, category: InvoiceType.IN ? InvoiceInCategory[0] : InvoiceOutCategory[0] });
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
    <form className='m-10' onSubmit={onSubmit}>
      <div className='indicator w-full'>
        <div className='indicator-item indicator-bottom'>
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
                  <span>ID</span>
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
                    className='w-4 h-4 mr-2 stroke-current'>
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
                <span>￥</span>
                <input
                  name='amount'
                  type='number'
                  disabled={isLoading}
                  className='input input-bordered'
                  step='.01'
                  value={item.amount}
                  min='0'
                  onChange={changeItemFields}
                />
              </label>
            </div>
            <div className='form-control'>
              <label className='input-group'>
                <span>￥</span>
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
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
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
              <DatePicker
                className={'input input-bordered max-w-[260px]'}
                onChange={(value) => {
                  setItem({ ...item, date: dayjs(value as Date).format('YYYY-MM-DD') });
                }}
                disabled={isLoading}
                value={item.date}
                locale={locale}
                format='y-MM-dd'
                clearIcon={null}
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
