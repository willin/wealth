'use client';
import clsx from 'classnames';
import { formatMoney, iBalance } from '@/app/[lang]/helper';

export function StatComp({ to, last: l }: { to: number; last: number }) {
  const last = l || 1;
  const diff = to - last;

  return (
    <div
      className={clsx('stat-desc', {
        'text-primary-focus': diff > 0,
        'text-secondary-focus': diff <= 0
      })}>
      {diff > 0 ? '↗︎' : '↘︎'} {formatMoney(diff)} ({Math.ceil((diff * 100) / last)}%)
    </div>
  );
}

export function MonthStats({
  compareMonthData,
  lastMonthData,
  t
}: {
  compareMonthData: iBalance;
  lastMonthData: iBalance;
  t: { [k: string]: string };
}) {
  return (
    <div className='stats shadow w-full bg-opacity-30 mb-6'>
      <div className='stat'>
        <div className='stat-title'>{t.IN}</div>
        <div className='stat-value text-primary'>{formatMoney(compareMonthData.IN)}</div>
        <StatComp to={compareMonthData.IN} last={lastMonthData.IN} />
      </div>

      <div className='stat'>
        <div className='stat-title'>{t.OUT}</div>
        <div className='stat-value text-secondary'>{formatMoney(compareMonthData.OUT)}</div>
        <StatComp to={compareMonthData.OUT} last={lastMonthData.OUT} />
      </div>

      <div className='stat'>
        <div className='stat-figure text-neutral'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block w-8 h-8 stroke-current'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'></path>
          </svg>
        </div>
        <div className='stat-title'>{t.BALANCE}</div>
        <div
          className={clsx('stat-value', {
            'text-primary': compareMonthData.BALANCE > 0,
            'text-secondary': compareMonthData.BALANCE <= 0
          })}>
          {formatMoney(compareMonthData.BALANCE)}
        </div>
        <StatComp to={compareMonthData.BALANCE} last={lastMonthData.BALANCE} />
      </div>
    </div>
  );
}
