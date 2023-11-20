import clsx from 'classnames';
import { type LoaderFunction, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { formatMoney } from '~/types';

export const loader: LoaderFunction = async ({ context, params }) => {
  const total = await context.services.invoice.getTotalData();
  const year = await context.services.invoice.getLastYearData({
    year: new Date().getFullYear() + 1
  });
  return json({ total, year });
};

export default function Index() {
  const i18n = useI18n();
  const { total, year } = useLoaderData<typeof loader>();
  const { t } = i18n;

  return (
    <div className='flex justify-center flex-col'>
      <div className='flex justify-center'>
        <div className='stats stats-vertical lg:stats-horizontal shadow'>
          <div className='stat'>
            <div className='stat-title'>{t('type.IN')}</div>
            <div className='stat-value text-secondary'>
              {formatMoney(total.IN || 0)}
            </div>
            <div className='stat-desc'>
              {t('common.this_year')} {formatMoney(year.IN || 0)}
            </div>
          </div>

          <div className='stat'>
            <div className='stat-title'>{t('type.OUT')}</div>
            <div className='stat-value text-primary'>
              {formatMoney(total.OUT || 0)}
            </div>
            <div className='stat-desc'>
              {t('common.this_year')} {formatMoney(year.OUT || 0)}
            </div>
          </div>

          <div className='stat'>
            <div className='stat-title'>{t('type.BALANCE')}</div>
            <div
              className={clsx('stat-value', {
                'text-primary': total.BALANCE < 0,
                'text-secondary': total.BALANCE >= 0
              })}>
              {formatMoney(total.BALANCE || 0)}
            </div>
            <div className='stat-desc'>
              {t('common.this_year')} {formatMoney(year.BALANCE || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
