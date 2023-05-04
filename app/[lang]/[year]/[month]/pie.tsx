'use client';
import { Invoice } from '@/db/types';
// @ts-nocheck
import { useState } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { formatMoney } from '../../helper';

const testData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 }
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
        {payload.name}
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
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill='#333'>{`${formatMoney(
        value as number
      )}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill='#999'>
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

export function PieView({ data }: { data: Invoice[] }) {
  const [activeIndex, setActiveIndex] = useState<number>();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Tooltip />
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={testData}
            cx='50%'
            cy='50%'
            innerRadius={60}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
            onMouseEnter={onPieEnter}
          />
          {/* <Pie data={data01} dataKey='value' cx='50%' cy='50%' outerRadius={60} fill='#8884d8' />
          <Pie data={data02} dataKey='value' cx='50%' cy='50%' innerRadius={70} outerRadius={90} fill='#82ca9d' label /> */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
