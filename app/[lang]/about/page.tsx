import Image from 'next/image';
import { translation } from '@/lib/i18n';
import { ContextParams } from '../helper';

export default async function AboutPage({ params: { lang } }: ContextParams) {
  const t = await translation(lang);

  return (
    <div>
      <div className='hero'>
        <div className='hero-content text-center'>
          <div className='max-w-2xl'>
            <h1 className='text-2xl md:text-4xl font-bold'>{t('meta.brief')}</h1>
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
                  <Image src='/images/alipay-fund.png' alt='Alipay Fund' width={256} height={256} />
                </div>
              </div>
              <div>
                <h3>{t('meta.douyin')}</h3>
                <div>
                  <input type='text' className='my-2 input select-text' defaultValue={'v0'} readOnly />
                </div>
                <div>
                  <Image src='/images/douyin.png' alt='Douyin' width={256} height={256} />
                </div>
              </div>
              <div>
                <h3>{t('meta.wechat')}</h3>
                <div>
                  <input type='text' className='my-2 input select-text' defaultValue={'初瘦'} readOnly />
                </div>
                <div>
                  <Image src='/images/qr.png' alt='Douyin' width={256} height={256} />
                </div>
              </div>
            </div>
            <div>
              <ul className='list-outside list-disc text-left my-4'>
                <li>
                  <a href='https://xiaobot.net/p/willin' target='_blank' className='link'>
                    小报童(付费专栏)
                  </a>
                </li>
                <li>
                  {t('meta.social')}：
                  <a href='https://log.lu/@willin' target='_blank' className='link'>
                    @willin@log.lu
                  </a>
                </li>
                <li>
                  <a href='https://space.bilibili.com/445780384' target='_blank' className='link'>
                    Bilibili
                  </a>
                </li>
                <li>
                  <a href='https://blog.csdn.net/jslygwx' target='_blank' className='link'>
                    CSDN 技术博客
                  </a>
                </li>
                <li>
                  <a href='https://github.com/willin' target='_blank' className='link'>
                    Github
                  </a>
                </li>
              </ul>
              <h2 className='text-2xl md:text-4xl font-bold my-4'>{t('category.DONATE')}</h2>
              <Image src='/images/donate.png' width={2198} height={1522} alt='Donate' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
