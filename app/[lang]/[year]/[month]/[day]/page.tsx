import { redirect } from 'next/navigation';
import { ContextParams } from '@/app/[lang]/helper';
import { getDayData, getLastDayData } from '@/db/public';
import { translation } from '@/lib/i18n';
import { InvoiceInCategory, InvoiceOutCategory, InvoiceType } from '@/db/types';
import dayjs from 'dayjs';
import Link from 'next/link';
import { MonthStats } from '../../stats';
import { PieView } from '../../pie';
import { DetailsTable } from './details';

export default async function Page({ params: { year, month, day, lang } }: ContextParams) {
  const date = new Date(+year, +month - 1, +day);
  if (date.toString() === 'Invalid Date') {
    return redirect('/');
  }
  const t = await translation(lang);
  const [dayData, lastDayData] = await Promise.all([
    getDayData({ year: +year, month: +month, day: +day }),
    getLastDayData({ year: +year, month: +month, day: +day })
  ]);
  const compareDayData = { IN: 0, OUT: 0, BALANCE: 0 };
  dayData.forEach((item) => {
    compareDayData[item.type as InvoiceType] += item.amount;
  });
  compareDayData.BALANCE = compareDayData.IN - compareDayData.OUT;
  const categories = [
    ...InvoiceInCategory.map((i) => ({ name: i, label: t(`category.${i}`) })),
    ...InvoiceOutCategory.map((i) => ({ name: i, label: t(`category.${i}`) }))
  ];
  const types = {
    IN: t('type.IN'),
    OUT: t('type.OUT'),
    BALANCE: t('type.BALANCE'),
    category: t('invoice.category'),
    amount: t('invoice.amount'),
    desc: t('invoice.desc')
  };
  const prev = dayjs(date).add(-1, 'day');
  const next = dayjs(date).add(1, 'day');

  return (
    <div>
      <div className='flex justify-between'>
        <Link href={`/${lang}/${prev.format('YYYY/M/D')}`} className='mx-4'>
          <svg
            className='h-6 w-6 fill-current md:h-8 md:w-8'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'></path>
          </svg>
        </Link>
        <h1 className='text-center text-5xl font-bold py-3'>
          {year}-{month.padStart(2, '0')}-{day.padStart(2, '0')}
        </h1>
        <Link href={`/${lang}/${next.format('YYYY/M/D')}`} className='mx-4'>
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

      <MonthStats toData={compareDayData} lastData={lastDayData} t={types} />
      <PieView data={dayData} categories={categories} t={types} hideTable={true}>
        <DetailsTable data={dayData} t={types} categories={categories} />
      </PieView>
    </div>
  );
}

export function generateMetadata({ params: { year, month, day } }: ContextParams) {
  return {
    title: `${year}-${`${month}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`
  };
}
