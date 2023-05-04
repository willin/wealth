import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { ContextParams } from '@/app/[lang]/helper';
import { getLastMonthData, getMonthData } from '@/db/public';
import { translation } from '@/lib/i18n';
import { MonthStats } from './stats';
import { Calendar } from './calendar';
import { InvoiceType } from '@/db/types';

export default async function Page({ params: { lang, year, month } }: ContextParams) {
  const date = new Date(+year, +month, 1);
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

  return (
    <div>
      <h1 className='text-center text-5xl font-bold py-3'>
        {year}-{month.padStart(2, '0')}
      </h1>
      <MonthStats
        compareMonthData={compareMonthData}
        lastMonthData={lastMonthData}
        t={{ IN: t('type.IN'), OUT: t('type.OUT'), BALANCE: t('type.BALANCE') }}
      />
      {/* <Calendar monthData={monthData} /> */}

      <pre>{JSON.stringify(monthData, null, 2)}</pre>
      <pre>{JSON.stringify(lastMonthData, null, 2)}</pre>
    </div>
  );
}

export function generateMetadata({ params: { year, month } }: ContextParams) {
  return {
    title: `${year}-${`${month}`.padStart(2, '0')}`
  };
}
