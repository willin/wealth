import { type ReactNode } from 'react';
import BackgroundImage from './background';
import Bootstrap from './bootstrap';
import MainHeader from './header';
import { BottomNav } from './bottom';
import { LocaleLink } from './link';
import { useI18n } from 'remix-i18n';

export default function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <>
      <BackgroundImage />
      <MainHeader />
      <main className='w-[960px] max-w-full mx-auto shadow bg-base-100/90 p-2 sm:p-4 mb-20'>
        <article className='prose'>{children}</article>
        <Bootstrap />
        <footer className='text-center text-sm mt-4'>
          <p>
            <a
              href='https://github.com/willin'
              target='_blank'
              className='inline-block'
              rel='noreferrer'>
              <img
                src='https://img.shields.io/github/followers/willin.svg?style=social&amp;label=Followers'
                alt='Github Followers'
              />
            </a>{' '}
            <a
              href='https://github.com/willin/wealth'
              target='_blank'
              className='inline-block'
              rel='noreferrer'>
              <img
                alt='GitHub Repo stars'
                src='https://img.shields.io/github/stars/willin/wealth?style=social'
              />
            </a>
          </p>
          <p>
            &copy;{' '}
            <a href='https://willin.wang' target='_blank' rel='noreferrer'>
              Willin Wang
            </a>{' '}
            &nbsp;
            <LocaleLink to='/wallet'>{t('common.login')}</LocaleLink>
          </p>
        </footer>
      </main>
      <BottomNav />
    </>
  );
}
