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
    <div>
      <div className='flex justify-center py-3'>
        <h2 className='text-center text-3xl font-bold'>{t('common.total')}</h2>
      </div>

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

      <div className='hero'>
        <div className='hero-content text-center'>
          <div className='max-w-2xl'>
            <h1 className='text-2xl md:text-4xl font-bold'>
              {t('meta.brief')}
            </h1>
            <p className='py-6'>{t('meta.intro')}</p>
            <div className='grid lg:grid-cols-3	gap-4 text-left'>
              <div>
                <h3>
                  {t('method.ALIPAY')} ({t('meta.alipay_account')})
                </h3>
                <div>
                  <input
                    type='text'
                    className='my-2 input select-text'
                    defaultValue={'g:/XNdyvDc88ND $660 n@r.PxkO 7737985 l:/N'}
                    readOnly
                  />
                </div>
                <div>
                  <img
                    src='/images/alipay-fund.png'
                    alt='Alipay Fund'
                    width={256}
                    height={256}
                  />
                </div>
              </div>
              <div>
                <h3>{t('meta.douyin')}</h3>
                <div>
                  <input
                    type='text'
                    className='my-2 input select-text'
                    defaultValue={'v0'}
                    readOnly
                  />
                </div>
                <div>
                  <img
                    src='/images/douyin.png'
                    alt='Douyin'
                    width={256}
                    height={256}
                  />
                </div>
              </div>
              <div>
                <h3>{t('meta.wechat')}</h3>
                <div>
                  <input
                    type='text'
                    className='my-2 input select-text'
                    defaultValue={'初瘦'}
                    readOnly
                  />
                </div>
                <div>
                  <img
                    src='/images/qr.png'
                    alt='Douyin'
                    width={256}
                    height={256}
                  />
                </div>
              </div>
            </div>
            <div>
              <ul className='list-outside list-disc text-left my-4'>
                <li>
                  <a
                    href='https://xiaobot.net/p/willin'
                    target='_blank'
                    className='link'>
                    小报童(付费专栏)
                  </a>
                </li>
                <li>
                  {t('meta.social')}：
                  <a
                    href='https://log.lu/@willin'
                    target='_blank'
                    className='link'>
                    @willin@log.lu
                  </a>
                </li>
                <li>
                  <a
                    href='https://space.bilibili.com/445780384'
                    target='_blank'
                    className='link'>
                    Bilibili
                  </a>
                </li>
                <li>
                  <a
                    href='https://blog.csdn.net/jslygwx'
                    target='_blank'
                    className='link'>
                    CSDN 技术博客
                  </a>
                </li>
                <li>
                  <a
                    href='https://github.com/willin'
                    target='_blank'
                    className='link'>
                    Github
                  </a>
                </li>
              </ul>
              <h2 className='text-2xl md:text-4xl font-bold my-4'>
                {t('category.DONATE')}
              </h2>
              <img
                src='/images/donate.png'
                width={2198}
                height={1522}
                alt='Donate'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
