import clsx from 'classnames';
import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth';
import { Invoice, InvoiceType, Pagination } from '@/db/types';
import { countInvoices, getInvoices } from '@/db/invoices';
import Error from './error';
import { FilterType } from './filters';
import Link from 'next/link';

export const revalidate = 60;

export default async function Page({
  params: { lang },
  searchParams
}: {
  params: { lang: Locale };
  searchParams: Partial<Invoice> & Pagination;
}) {
  const t = await translation(lang);
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <Error lang={lang} goBack={t('common.go_back')} forbidden={t('common.forbidden')} login={t('common.login')} />
    );
  }

  const [count, list] = await Promise.all([countInvoices(searchParams), getInvoices(searchParams)]);

  return (
    <div className='overflow-x-auto md:p-3'>
      <div>
        <FilterType
          type={searchParams.type as InvoiceType}
          tAll={t('common.all')}
          tIn={t('type.IN')}
          tOut={t('type.OUT')}
        />
      </div>
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
              <td>{item.date as any as string}</td>
              <td>
                <span
                  className={clsx({
                    'text-green-600': item.type === InvoiceType.IN,
                    'text-red-600': item.type === InvoiceType.OUT
                  })}>
                  ￥{item.type === InvoiceType.OUT ? '-' : ''}
                  {item.amount}
                </span>
              </td>
              <td>{t(`category.${item.category}`)}</td>
              <td>{t(`method.${item.method}`)}</td>
              <th>
                <Link href={`/wallet/${item.id}`} className='btn-link'>
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
  );
}
