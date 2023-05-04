import clsx from 'classnames';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';
import { Invoice, InvoiceType, Pagination } from '@/db/types';
import { countInvoices, getInvoices } from '@/db/invoices';
import { FilterType } from './filters';
import { Paginator } from './pagination';
import { formatMoney } from '../helper';

export const revalidate = 60;

export default async function Page({
  params: { lang },
  searchParams
}: {
  params: { lang: Locale };
  searchParams: Partial<Invoice> & Pagination;
}) {
  const t = await translation(lang);

  // eslint-disable-next-line no-unused-vars
  const [count, list] = await Promise.all([countInvoices(searchParams), getInvoices(searchParams)]);

  return (
    <div>
      <FilterType
        type={searchParams.type as InvoiceType}
        tAll={t('common.all')}
        tIn={t('type.IN')}
        tOut={t('type.OUT')}
      />
      <div className='overflow-x-auto md:p-3'>
        <table className='table table-compact table-zebra w-full max-w-full mx-auto'>
          <thead>
            <tr>
              <th>
                <Link href='/wallet/create' className='btn'>
                  +
                </Link>
              </th>
              <th>{t('invoice.date')}</th>
              <th>{t('invoice.amount')}</th>
              <th>{t('invoice.category')}</th>
              <th>{t('invoice.method')}</th>
              <th>{t('common.operation')}</th>
              <th>{t('invoice.desc')}</th>
              <th>{t('invoice.note')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className='hover'>
                <th>{item.id}</th>
                <td>{dayjs(item.date).format('YYYY-MM-DD')}</td>
                <td>
                  <span
                    className={clsx({
                      'text-primary': item.type === InvoiceType.IN,
                      'text-secondary': item.type === InvoiceType.OUT
                    })}>
                    {formatMoney(item.type === InvoiceType.IN ? item.amount : -item.amount)}
                  </span>
                </td>
                <td>{t(`category.${item.category}`)}</td>
                <td>{t(`method.${item.method}`)}</td>
                <th>
                  <Link href={`/wallet/${item.id!}`} className='btn-link text-info'>
                    {t('common.edit')}
                  </Link>
                </th>
                <td>{item.desc}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginator count={count} params={searchParams} />
    </div>
  );
}
