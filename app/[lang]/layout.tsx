import './globals.css';
import dayjs from 'dayjs';
import 'dayjs/locale/zh';
import 'dayjs/locale/en';
import { i18n } from '@/i18n-config';
import { BackgroundImage } from './background';
import { MainHeader } from './header';
import { ContextParams } from './context';
import { Metadata } from 'next';
import { BaseURL } from '@/lib/config';
import { BottomNav } from './bottom';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: {
    default: 'Willin Wang 长岛冰泪',
    template: '%s | Willin Wang 长岛冰泪'
  },
  description: '不走老路。 To be Willin is to be willing.',
  keywords: ['Next.js', 'React', 'JavaScript', 'Willin Wang'],
  authors: [{ name: 'Willin Wang', url: 'https://willin.wang' }],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico'
  },
  appleWebApp: {
    capable: true,
    title: '$Willin$',
    statusBarStyle: 'black-translucent'
  },
  appLinks: {
    web: {
      url: BaseURL,
      should_fallback: true
    }
  },
  alternates: {
    canonical: BaseURL,
    languages: {
      'en-US': `${BaseURL}/en`,
      'zh-CN': `${BaseURL}/zh`
    }
  }
};

export default function RootLayout({ children, params }: { children: React.ReactNode } & ContextParams) {
  dayjs.locale(params.lang);

  return (
    <html lang={params.lang}>
      <head />
      <body>
        <BackgroundImage />
        <MainHeader />
        <div className='container mx-auto shadow bg-neutral/70 p-2 sm:p-4'>{children}</div>
        <BottomNav lang={params.lang} />
      </body>
    </html>
  );
}

export const revalidate = 3600;
