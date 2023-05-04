import dayjs from 'dayjs';
import Link from 'next/link';
import { ContextParams } from '@/app/[lang]/helper';
import { redirect } from 'next/navigation';
import { getLastYearData, getYearData } from '@/db/public';
import { translation } from '@/lib/i18n';
import { MonthStats } from './stats';
import { InvoiceInCategory, InvoiceOutCategory, InvoiceType } from '@/db/types';
import { PieView } from './pie';
import { YearView } from './year';

export default async function Page({ params: { lang, year } }: ContextParams) {
  const date = new Date(+year, 0, 1);
  if (date.toString() === 'Invalid Date') {
    return redirect('/');
  }

  const t = await translation(lang);
  const [yearData, lastYearData] = await Promise.all([getYearData({ year: +year }), getLastYearData({ year: +year })]);
  const compareYearData = { IN: 0, OUT: 0, BALANCE: 0 };
  yearData.forEach((item) => {
    compareYearData[item.type as InvoiceType] += item.amount;
  });
  compareYearData.BALANCE = compareYearData.IN - compareYearData.OUT;
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
  const prev = dayjs(date).add(-1, 'year');
  const next = dayjs(date).add(1, 'year');

  return (
    <div>
      <div className='flex justify-between'>
        <Link href={`/${lang}/${prev.year()}`} className='mx-4'>
          <svg
            className='h-6 w-6 fill-current md:h-8 md:w-8'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'></path>
          </svg>
        </Link>
        <h1 className='text-center text-5xl font-bold py-3'>{year}</h1>
        <Link href={`/${lang}/${next.year()}`} className='mx-4'>
          <svg
            className='h-6 w-6 fill-current md:h-8 md:w-8'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'></path>
          </svg>
        </Link>
      </div>

      <MonthStats toData={compareYearData} lastData={lastYearData} t={types} />
      <YearView data={yearData} t={types} />
      <PieView data={yearData} categories={categories} t={types} summary={compareYearData} />
    </div>
  );
}

export function generateMetadata({ params: { year } }: ContextParams) {
  return {
    title: `${year}`
  };
}
