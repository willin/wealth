import dayjs from 'dayjs';
import clsx from 'classnames';
import { type LoaderFunction, json, redirect } from '@remix-run/cloudflare';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { FilterType } from '~/components/atom/filters';
import { Paginator } from '~/components/atom/pagination';
import { LocaleLink } from '~/components/link';
import { InvoiceType, formatMoney } from '~/types';

export const loader: LoaderFunction = async ({ context, request, params }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(
    request,
    {
      failureRedirect: '/auth/sso'
    }
  );
  console.log(JSON.stringify(user, null, 2));
  if (user?.type !== 'admin') {
    return redirect('/');
  }

  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries()) || {};
  const { invoice } = context.services;
  const [count, list] = await Promise.all([
    invoice.countInvoices(searchParams),
    invoice.getInvoices(searchParams)
  ]);
  return json({
    count,
    list
  });
};

export default function WalletPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const { count, list } = useLoaderData<typeof loader>();

  return (
    <div>
      <FilterType
        type={searchParams.get('type') || ''}
        tAll={t('common.all')}
        tIn={t('type.IN')}
        tOut={t('type.OUT')}
      />
      <div className='overflow-x-auto md:p-3'>
        <table className='table table-compact table-zebra w-full max-w-full mx-auto'>
          <thead>
            <tr>
              <th>
                <LocaleLink to='/wallet/edit' className='btn'>
                  +
                </LocaleLink>
              </th>
              <th>{t('invoice.date')}</th>
              <th>{t('invoice.amount')}</th>
              <th>{t('invoice.category')}</th>
              <th>{t('invoice.method')}</th>
              <th>{t('common.operation')}</th>
              <th>{t('invoice.description')}</th>
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
                    {formatMoney(
                      item.type === InvoiceType.IN ? item.amount : -item.amount
                    )}
                  </span>
                </td>
                <td>{t(`category.${item.category}`)}</td>
                <td>{t(`method.${item.method}`)}</td>
                <th>
                  <LocaleLink
                    to={`/wallet/edit/${item.id!}`}
                    className='btn-link text-info'>
                    {t('common.edit')}
                  </LocaleLink>
                </th>
                <td>{item.description}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginator total={count} />
    </div>
  );
}
