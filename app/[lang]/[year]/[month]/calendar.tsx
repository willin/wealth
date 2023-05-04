'use client';
import clsx from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh';
import { useParams } from 'next/navigation';
import { Invoice, InvoiceType } from '@/db/types';
import { formatMoney } from '@/app/[lang]/helper';
import Link from 'next/link';

export function Calendar({ data }: { data: Invoice[] }) {
  const params = useParams();
  dayjs.locale(params.lang);
  const year = +params.year;
  const month = +params.month;
  const days = new Date(year, month, 0).getDate();
  const weekday = new Date(year, month - 1, 1).getDay();
  const grids = new Array(days).fill(0).map((_, i) => ({
    date: `${year}-${month.toString().padStart(2, '0')}-${`${i + 1}`.padStart(2, '0')}`,
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

  const date = new Date();
  const week = new Array(7).fill(0).map((_, i) => i);

  return (
    <div className='grid grid-cols-7 gap-4 text-center py-4'>
      {week.map((day) => (
        <div key={`d-${day}`}>{dayjs(date).startOf('week').add(day, 'day').format('ddd')}</div>
      ))}
      {grids.map((day, i) => (
        <div
          key={day.date}
          className={clsx({
            'col-start-2': i === 0 && weekday === 1,
            'col-start-3': i === 0 && weekday === 2,
            'col-start-4': i === 0 && weekday === 3,
            'col-start-5': i === 0 && weekday === 4,
            'col-start-6': i === 0 && weekday === 5,
            'col-start-7': i === 0 && weekday === 6
          })}>
          <Link href={`/${params.lang}/${day.date.replace(/-/g, '/').replace(/0/g, '')}`}>
            <p>{i + 1}</p>
            <p
              className={clsx('whitespace-nowrap text-xs', {
                'text-primary': day.BALANCE > 0,
                'text-secondary': day.BALANCE < 0,
                hidden: day.BALANCE === 0
              })}>
              {formatMoney(day.BALANCE)}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
