import dayjs from 'dayjs';
import {
  redirect,
  type LoaderFunction,
  json,
  type MetaFunction
} from '@remix-run/cloudflare';
import { useLoaderData, useParams } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { Calendar } from '~/components/atom/calender';
import { LocaleLink } from '~/components/link';
import { PieView } from '~/components/atom/pie';
import { MainStats } from '~/components/atom/stats';
import { InvoiceInCategory, InvoiceOutCategory } from '~/types';

export const meta: MetaFunction = ({ params }) => {
  const { year, month } = params;
  return [{ title: `${year}-${`${month}`.padStart(2, '0')} | Willin Wealth` }];
};

export const loader: LoaderFunction = async ({ context, request, params }) => {
  const { year, month } = params;

  const date = new Date(+year, +month - 1, 1);
  if (date.toString() === 'Invalid Date') {
    return redirect('/');
  }
  const { invoice } = context.services;
  const [monthData, lastMonthData] = await Promise.all([
    invoice.getMonthData({ year: +year, month: +month }),
    invoice.getLastMonthData({ year: +year, month: +month })
  ]);

  return json({
    monthData,
    lastMonthData
  });
};

export default function MonthPage() {
  const { year, month } = useParams();
  const { monthData, lastMonthData } = useLoaderData<typeof loader>();
  const { t } = useI18n();

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
  const date = new Date(+year, +month - 1, 1);
  const prev = dayjs(date).add(-1, 'month');
  const next = dayjs(date).add(1, 'month');

  return (
    <div>
      <div className='flex justify-between py-3'>
        <LocaleLink to={`/data/${prev.year()}/${prev.month() + 1}`} className='mx-4'>
          <svg
            className='fill-current h-12 w-12'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'></path>
          </svg>
        </LocaleLink>
        <h1 className='text-center text-5xl font-bold'>
          {year}-{month.padStart(2, '0')}
        </h1>
        <LocaleLink to={`/data/${next.year()}/${next.month() + 1}`} className='mx-4'>
          <svg
            className='fill-current h-12 w-12'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'></path>
          </svg>
        </LocaleLink>
      </div>

      <MainStats toData={compareMonthData} lastData={lastMonthData} t={types} />
      <Calendar data={monthData} t={types} />
      <PieView
        data={monthData}
        categories={categories}
        t={types}
        summary={compareMonthData}
      />
    </div>
  );
}
