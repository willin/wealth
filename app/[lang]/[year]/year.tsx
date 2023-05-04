'use client';
// @ts-nocheck
import clsx from 'classnames';
import dayjs from 'dayjs';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'dayjs/locale/en';
import 'dayjs/locale/zh';
import { useParams } from 'next/navigation';
import { Invoice, InvoiceType } from '@/db/types';
import { formatMoney } from '@/app/[lang]/helper';
import Link from 'next/link';

const monthTickFormatter = (tick: string) => {
  const date = new Date(tick);

  return `${date.getMonth() + 1}`;
};

const renderQuarterTick = (tickProps: { x: number; y: number; payload: { value: string; offset: number } }) => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;
  // const isMidMonth = month % 3 === 1;

  if (month % 3 === 1) {
    return <text x={x} y={y - 4} textAnchor='middle' fill='currentcolor'>{`Q${quarterNo}`}</text>;
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke='currentcolor' />;
  }
  return null;
};

export function YearView({ data, t }: { data: Invoice[]; t: { [k: string]: string } }) {
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
    <div>
      <div className='grid grid-cols-4 gap-4 text-center py-4'>
        {grids.map((day) => (
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
      <div className='w-full'>
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <ComposedChart
              width={500}
              height={300}
              data={grids}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
              }}>
              <CartesianGrid stroke='currentcolor' />
              <XAxis dataKey='date' tickFormatter={monthTickFormatter} fill='currentcolor' />
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={renderQuarterTick as any}
                height={1}
                scale='band'
                xAxisId='quarter'
              />
              <YAxis />
              <Tooltip formatter={(value: any, name: string) => [formatMoney(value as number), t[name]]} />
              <Legend formatter={(name: string) => t[name]} />
              <Bar dataKey='IN' barSize={20} fill='hsl(var(--p))' />
              <Bar dataKey='OUT' barSize={20} fill='hsl(var(--s))' />
              <Line type='monotone' dataKey='BALANCE' stroke='hsl(var(--a))' strokeDasharray='5 5' />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
