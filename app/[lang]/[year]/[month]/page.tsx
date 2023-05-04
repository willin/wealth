import { redirect } from 'next/navigation';
import { ContextParams } from '@/app/[lang]/helper';
import { getLastMonthData, getMonthData } from '@/db/public';
import { translation } from '@/lib/i18n';
import { MonthStats } from './stats';
import { Calendar } from './calendar';
import { InvoiceInCategory, InvoiceOutCategory, InvoiceType } from '@/db/types';
import { PieView } from './pie';

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

  return (
    <div>
      <h1 className='text-center text-5xl font-bold py-3'>
        {year}-{month.padStart(2, '0')}
      </h1>
      <MonthStats compareMonthData={compareMonthData} lastMonthData={lastMonthData} t={types} />
      <Calendar data={monthData} />
      <PieView data={monthData} categories={categories} t={types} />
    </div>
  );
}

export function generateMetadata({ params: { year, month } }: ContextParams) {
  return {
    title: `${year}-${`${month}`.padStart(2, '0')}`
  };
}
