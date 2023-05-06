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
import { useEffect, useState } from 'react';
import { GridSpan } from './stats';

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window === 'undefined' ? 0 : window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

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

  const isLast = month === 12;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke='currentcolor' />;
  }
  return null;
};

export function YearView({ data, t }: { data: Invoice[]; t: { [k: string]: string } }) {
  const [showType, setShowType] = useState<'IN' | 'OUT' | 'BALANCE'>('BALANCE');
  const params = useParams();
  const width = useWindowWidth();
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
      <div className='flex justify-center'>
        <div className='form-control'>
          <label className='input-group'>
            <span> {t.category}</span>
            {/* @ts-ignore */}
            <select className='select' value={showType} onChange={(e) => setShowType(e.target.value)}>
              <option value={InvoiceType.IN}>{t.IN}</option>
              <option value={InvoiceType.OUT}>{t.OUT}</option>
              <option value={'BALANCE'}>{t.BALANCE}</option>
            </select>{' '}
          </label>
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4 text-center py-4'>
        {grids.map((day) => (
          <div key={day.date}>
            <Link href={`/${params.lang}/${dayjs(day.date).format(`YYYY/M`)}`}>
              <p>{dayjs(day.date).format('MMM')}</p>
              <GridSpan value={day[showType]} />
            </Link>
          </div>
        ))}
      </div>
      <div className='w-full lg:m-4'>
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <ComposedChart width={500} height={300} data={grids}>
              <CartesianGrid stroke='currentcolor' strokeDasharray='3 3' />
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
              <YAxis hide={width < 768} tickFormatter={(v: any) => `${Math.ceil(v / 100) / 10}k`} />
              <Tooltip formatter={(value: any, name: string) => [formatMoney(value as number), t[name]]} />
              <Legend formatter={(name: string) => t[name]} />
              <Bar dataKey='IN' barSize={20} fill='hsl(var(--p))' />
              <Bar dataKey='OUT' barSize={20} fill='hsl(var(--s))' />
              <Line type='monotone' dataKey='BALANCE' stroke='hsl(var(--a))' />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
