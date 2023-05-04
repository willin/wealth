'use client';
import { Invoice, InvoiceType } from '@/db/types';
// @ts-nocheck
import clsx from 'classnames';
import { useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Sector, Cell } from 'recharts';
import { formatMoney } from '@/app/[lang]/helper';

const COLORS = [
  'hsl(var(--in))',
  'hsl(var(--su))',
  'hsl(var(--wa))',
  'hsl(var(--er))',
  'hsl(var(--p))',
  'hsl(var(--s))',
  // 'hsl(var(--n))',
  'hsl(var(--a))'
];

// @ts-ignore
const renderActiveShape = (props) => {
  /* eslint-disable @typescript-eslint/restrict-plus-operands */
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
        {payload.category}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={fill}>{`${formatMoney(
        value as number
      )}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill='#999'>
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

export function TableView({ data, t }: { data: Invoice[]; t: { [k: string]: string } }) {
  return (
    <div
      className={clsx('w-full lg:w-1/2 lg:px-10 pt-4', {
        hidden: data.length === 0
      })}>
      <table className='table table-zebra w-full max-w-full'>
        <thead>
          <tr>
            <th>{t.category}</th>
            <th>{t.amount}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr className='hover' key={item.category}>
              <td>{item.category}</td>
              <td>{formatMoney(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PieView({
  data,
  categories,
  hideTable,
  t,
  children
}: {
  data: Invoice[];
  categories: { name: string; label: string }[];
  t: { [k: string]: string };
  hideTable?: boolean;
  children?: React.ReactNode;
}) {
  const [activeIndexIn, setActiveIndexIn] = useState<number>(0);
  const [activeIndexOut, setActiveIndexOut] = useState<number>(0);

  const onPieEnterIn = (_: any, index: number) => {
    setActiveIndexIn(index);
  };
  const onPieEnterOut = (_: any, index: number) => {
    setActiveIndexOut(index);
  };
  const detail: {
    IN: Invoice[];
    OUT: Invoice[];
  } = {
    IN: [],
    OUT: []
  };

  data.forEach((item) => {
    const category = categories.find((x) => x.name === item.category);
    const index = detail[item.type as InvoiceType].findIndex((x) => x.category === category?.label);
    if (index > -1) {
      detail[item.type as InvoiceType][index].amount += item.amount;
    } else {
      const nd = {
        category: category?.label,
        amount: item.amount
      };
      detail[item.type as InvoiceType].push(nd as any as Invoice);
    }
  });

  return (
    <div className='flex lg:flex-row flex-col mb-10 flex-wrap'>
      <div
        className={clsx('w-full lg:w-1/2 h-[300px]', {
          hidden: detail.IN.length === 0
        })}>
        <h2 className='text-center text-2xl font-bold py-3'>{t.IN}</h2>
        <ResponsiveContainer>
          <PieChart width={300} height={300}>
            <Pie
              activeIndex={activeIndexIn}
              activeShape={renderActiveShape}
              data={detail.IN}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={80}
              fill='hsl(var(--p))'
              dataKey='amount'
              onMouseEnter={onPieEnterIn}>
              {detail.IN.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div
        className={clsx('w-full lg:w-1/2 h-[300px]', {
          hidden: detail.OUT.length === 0
        })}>
        <h2 className='text-center text-2xl font-bold py-3'>{t.OUT}</h2>
        <ResponsiveContainer>
          <PieChart width={300} height={300}>
            <Pie
              activeIndex={activeIndexOut}
              activeShape={renderActiveShape}
              data={detail.OUT}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={80}
              fill='hsl(var(--s))'
              dataKey='amount'
              onMouseEnter={onPieEnterOut}>
              {detail.OUT.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {!hideTable && (
        <>
          <TableView data={detail.IN} t={t} />
          <TableView data={detail.OUT} t={t} />
        </>
      )}
      {children}
    </div>
  );
}
