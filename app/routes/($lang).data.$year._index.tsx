import dayjs from 'dayjs';
import {
  json,
  type MetaFunction,
  type LoaderFunction,
  redirect
} from '@remix-run/cloudflare';
import { useLoaderData, useParams } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { LocaleLink } from '~/components/link';
import { PieView } from '~/components/atom/pie';
import { MainStats } from '~/components/atom/stats';
import { YearView } from '~/components/atom/year';
import { InvoiceInCategory, InvoiceOutCategory } from '~/types';

export const meta: MetaFunction = ({ params }) => {
  const { year } = params;
  return [{ title: `${year} | Willin Wealth` }];
};

export const loader: LoaderFunction = async ({ context, params, request }) => {
  const { year } = params;
  const date = new Date(+year, 0, 1);
  if (date.toString() === 'Invalid Date') {
    return redirect('/');
  }
  const { invoice } = context.services;
  const [yearData, lastYearData] = await Promise.all([
    invoice.getYearData({ year: +year }),
    invoice.getLastYearData({ year: +year })
  ]);
  return json({
    yearData,
    lastYearData
  });
};

export default function YearPage() {
  const { t } = useI18n();
  const { yearData, lastYearData } = useLoaderData<typeof loader>();
  const { year } = useParams();
  const date = new Date(+year, 0, 1);

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
      <div className='flex justify-between py-3'>
        <LocaleLink to={`/data/${prev.year()}`} className='mx-4'>
          <svg
            className='fill-current h-12 w-12'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'></path>
          </svg>
        </LocaleLink>
        <h1 className='text-center text-5xl font-bold'>{year}</h1>
        <LocaleLink to={`/data/${next.year()}`} className='mx-4'>
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

      <MainStats toData={compareYearData} lastData={lastYearData} t={types} />
      <YearView data={yearData} t={types} />
      <PieView
        data={yearData}
        categories={categories}
        t={types}
        summary={compareYearData}
      />
    </div>
  );
}
