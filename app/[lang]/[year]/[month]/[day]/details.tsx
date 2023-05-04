import clsx from 'classnames';
import { formatMoney } from '@/app/[lang]/helper';
import { Invoice, InvoiceType } from '@/db/types';

export function TableDailyView({
  data,
  t,
  categories
}: {
  data: Invoice[];
  t: { [k: string]: string };
  categories: { name: string; label: string }[];
}) {
  if (!categories) return null;
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
            <th>{t.desc}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr className='hover' key={item.id} id={`id-${item.id!}`}>
              <td>{categories.find((x) => x.name === item.category)?.label}</td>
              <td>{formatMoney(item.amount)}</td>
              <td>{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DetailsTable({
  data,
  categories,
  t
}: {
  data: Invoice[];
  t: { [k: string]: string };
  categories: { name: string; label: string }[];
}) {
  const inData = data.filter((item) => item.type === InvoiceType.IN);
  const outData = data.filter((item) => item.type === InvoiceType.OUT);
  return (
    <>
      <TableDailyView data={inData} t={t} categories={categories} />
      <TableDailyView data={outData} t={t} categories={categories} />
    </>
  );
}
