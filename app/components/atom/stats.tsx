import clsx from 'classnames';
import { formatMoney, type iBalance } from '~/types';

export function GridSpan({ value }: { value: number }) {
  return (
    <p
      className={clsx('whitespace-nowrap text-xs', {
        'text-primary': value > 0,
        'text-secondary': value < 0
      })}>
      {formatMoney(value)}
    </p>
  );
}

export function StatComp({ to, last: l }: { to: number; last: number }) {
  const last = l || 1;
  const diff = to - l;

  return (
    <div
      className={clsx('stat-desc', {
        'text-primary-focus': diff > 0,
        'text-secondary-focus': diff <= 0
      })}>
      <div className='inline-flex p-1' style={{ verticalAlign: 'sub' }}>
        {diff > 0 ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            class='h-4 w-4 text-red-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            class='h-4 w-4 text-green-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
            />
          </svg>
        )}
      </div>{' '}
      {formatMoney(diff)} ({Math.ceil((diff * 100) / last)}%)
    </div>
  );
}

export function MainStats({
  toData,
  lastData,
  hideCompare,
  t
}: {
  hideCompare?: boolean;
  toData: iBalance;
  lastData: iBalance;
  t: { [k: string]: string };
}) {
  return (
    <div className='stats stats-vertical lg:stats-horizontal shadow w-full bg-opacity-30 mb-6'>
      <div className='stat'>
        <div className='stat-title'>{t.IN}</div>
        <div className='stat-value text-primary'>{formatMoney(toData.IN)}</div>
        {!hideCompare && <StatComp to={toData.IN} last={lastData.IN} />}
      </div>

      <div className='stat'>
        <div className='stat-title'>{t.OUT}</div>
        <div className='stat-value text-secondary'>
          {formatMoney(toData.OUT)}
        </div>
        {!hideCompare && <StatComp to={toData.OUT} last={lastData.OUT} />}
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
            'text-primary': toData.BALANCE > 0,
            'text-secondary': toData.BALANCE <= 0
          })}>
          {formatMoney(toData.BALANCE)}
        </div>
        {!hideCompare && (
          <StatComp to={toData.BALANCE} last={lastData.BALANCE} />
        )}
      </div>
    </div>
  );
}
