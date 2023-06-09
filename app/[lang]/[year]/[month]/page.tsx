import { redirect } from 'next/navigation';
import { ContextParams } from '@/app/[lang]/helper';
import { getLastMonthData, getMonthData } from '@/db/public';
import { translation } from '@/lib/i18n';
import { MainStats } from '../stats';
import { Calendar } from './calendar';
import { InvoiceInCategory, InvoiceOutCategory, InvoiceType } from '@/db/types';
import { PieView } from '../pie';
import dayjs from 'dayjs';
import Link from 'next/link';

export default async function Page({ params: { lang, year, month } }: ContextParams) {
  const date = new Date(+year, +month - 1, 1);
  if (date.toString() === 'Invalid Date') {
    return redirect('/');
  }
  const t = await translation(lang);
  const [monthData, lastMonthData] = await Promise.all([
    getMonthData({ year: +year, month: +month }),
    getLastMonthData({ year: +year, month: +month })
  ]);
  const compareMonthData = { IN: 0, OUT: 0, BALANCE: 0 };
  monthData.forEach((item) => {
    compareMonthData[item.type as InvoiceType] += item.amount;
  });
  compareMonthData.BALANCE = compareMonthData.IN - compareMonthData.OUT;
  const categories = [
    ...InvoiceInCategory.map((i) => ({ name: i, label: t(`category.${i}`) })),
    ...InvoiceOutCategory.map((i) => ({ name: i, label: t(`category.${i}`) }))
  ];
  const types = {
    IN: t('type.IN'),
    OUT: t('type.OUT'),
    BALANCE: t('type.BALANCE'),
    category: t('invoice.category'),
    amount: t('invoice.amount')
  };
  const prev = dayjs(date).add(-1, 'month');
  const next = dayjs(date).add(1, 'month');

  return (
    <div>
      <div className='flex justify-between py-3'>
        <Link href={`/${lang}/${prev.year()}/${prev.month() + 1}`} className='mx-4'>
          <svg
            className='fill-current h-12 w-12'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'></path>
          </svg>
        </Link>
        <h1 className='text-center text-5xl font-bold'>
          {year}-{month.padStart(2, '0')}
        </h1>
        <Link href={`/${lang}/${next.year()}/${next.month() + 1}`} className='mx-4'>
          <svg
            className='fill-current h-12 w-12'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'></path>
          </svg>
        </Link>
      </div>

      <MainStats toData={compareMonthData} lastData={lastMonthData} t={types} />
      <Calendar data={monthData} t={types} />
      <PieView data={monthData} categories={categories} t={types} summary={compareMonthData} />
    </div>
  );
}

export function generateMetadata({ params: { year, month } }: ContextParams) {
  return {
    title: `${year}-${`${month}`.padStart(2, '0')}`
  };
}
