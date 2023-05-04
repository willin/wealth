'use client';
import clsx from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh';
import { useParams } from 'next/navigation';
import { Invoice, InvoiceType } from '@/db/types';
import { formatMoney } from '@/app/[lang]/helper';
import Link from 'next/link';

export function YearView({ data }: { data: Invoice[] }) {
  const params = useParams();
  dayjs.locale(params.lang);
  const year = +params.year;
  const grids = new Array(12).fill(0).map((_, i) => ({
    date: `${year}-${`${i + 1}`.padStart(2, '0')}`,
    IN: 0,
    OUT: 0,
    BALANCE: 0
  }));
  data.forEach((item) => {
    const index = grids.findIndex((grid) => grid.date === item.date);
    if (index > -1) {
      grids[index][item.type as InvoiceType] += item.amount;
      grids[index].BALANCE = grids[index].IN - grids[index].OUT;
    }
  });

  return (
    <div className='grid grid-cols-4 gap-4 text-center py-4'>
      {grids.map((day, i) => (
        <div key={day.date}>
          <Link href={`/${params.lang}/${dayjs(day.date).format(`YYYY/M`)}`}>
            <p>{dayjs(day.date).format('MMM')}</p>
            <p
              className={clsx('whitespace-nowrap text-xs', {
                'text-primary': day.BALANCE > 0,
                'text-secondary': day.BALANCE < 0
              })}>
              {formatMoney(day.BALANCE)}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
