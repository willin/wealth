import dayjs from 'dayjs';
import {
  redirect,
  type LoaderFunction,
  json,
  type MetaFunction
} from '@remix-run/cloudflare';
import { useLoaderData, useParams } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { LocaleLink } from '~/components/link';
import { PieView } from '~/components/atom/pie';
import { MainStats } from '~/components/atom/stats';
import { DetailsTable } from '~/components/atom/details';
import { InvoiceInCategory, InvoiceOutCategory } from '~/types';

export const meta: MetaFunction = ({ params }) => {
  const { year, month, day } = params;
  return [
    { title: `${year}-${`${month}-${day}`.padStart(2, '0')} | Willin Wealth` }
  ];
};

export const loader: LoaderFunction = async ({ context, request, params }) => {
  const { year, month, day } = params;
  const date = new Date(+year, +month - 1, +day);
  if (date.toString() === 'Invalid Date') {
    return redirect('/');
  }
  const { invoice } = context.services;
  const [dayData, lastDayData] = await Promise.all([
    invoice.getDayData({ year: +year, month: +month, day: +day }),
    invoice.getLastDayData({ year: +year, month: +month, day: +day })
  ]);

  return json({
    dayData,
    lastDayData
  });
};

export default function DayPage() {
  const { year, month, day } = useParams();
  const { t } = useI18n();
  const { dayData, lastDayData } = useLoaderData<typeof loader>();

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
  const date = new Date(+year, +month - 1, +day);
  const prev = dayjs(date).add(-1, 'day');
  const next = dayjs(date).add(1, 'day');

  return (
    <div>
      <div className='flex justify-between py-3'>
        <LocaleLink to={`/data/${prev.format('YYYY/M/D')}`} className='mx-4'>
          <svg
            className='fill-current h-9 w-9'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z'></path>
          </svg>
        </LocaleLink>
        <h1 className='text-center text-4xl font-bold'>
          {year}-{month.padStart(2, '0')}-{day.padStart(2, '0')}
        </h1>
        <LocaleLink to={`/data/${next.format('YYYY/M/D')}`} className='mx-4'>
          <svg
            className='fill-current h-9 w-9'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'></path>
          </svg>
        </LocaleLink>
      </div>

      <MainStats toData={compareDayData} lastData={lastDayData} t={types} />
      <PieView
        data={dayData}
        categories={categories}
        t={types}
        summary={compareDayData}
        hideTable={true}>
        <DetailsTable data={dayData} t={types} categories={categories} />
      </PieView>
    </div>
  );
}
