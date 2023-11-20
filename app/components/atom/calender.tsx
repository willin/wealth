import clsx from 'classnames';
import dayjs from 'dayjs';
import { type Invoice, InvoiceType } from '~/types';
import { GridSpan } from '../atom/stats';
import { useState } from 'react';
import { LocaleLink } from '../link';
import { useParams } from '@remix-run/react';

export function Calendar({
  data,
  t
}: {
  data: Invoice[];
  t: { [k: string]: string };
}) {
  const [showType, setShowType] = useState<'IN' | 'OUT' | 'BALANCE'>('BALANCE');
  const params = useParams();
  const year = +params.year;
  const month = +params.month;
  const days = new Date(year, month, 0).getDate();
  const weekday = new Date(year, month - 1, 1).getDay();
  const grids = new Array(days).fill(0).map((_, i) => ({
    date: `${year}-${month.toString().padStart(2, '0')}-${`${i + 1}`.padStart(
      2,
      '0'
    )}`,
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
    <div>
      <div className='flex justify-center'>
        <div className='form-control'>
          <label className='input-group'>
            <span> {t.category}</span>
            {/* @ts-ignore */}
            <select
              className='select'
              value={showType}
              onChange={(e) => setShowType(e.target.value)}>
              <option value={InvoiceType.IN}>{t.IN}</option>
              <option value={InvoiceType.OUT}>{t.OUT}</option>
              <option value={'BALANCE'}>{t.BALANCE}</option>
            </select>
          </label>
        </div>
      </div>
      <div className='grid grid-cols-7 gap-4 text-center py-4'>
        {week.map((day) => (
          <div key={`d-${day}`}>
            {dayjs(date)
              .startOf('week')
              .add(day - 1, 'day')
              .format('ddd')}
          </div>
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
            <LocaleLink to={`/data/${dayjs(day.date).format('YYYY/M/D')}`}>
              <p>{i + 1}</p>
              <GridSpan value={day[showType]} />
            </LocaleLink>
          </div>
        ))}
      </div>
    </div>
  );
}
