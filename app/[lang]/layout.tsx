import './globals.css';
import { i18n } from '@/i18n-config';
import { BackgroundImage } from './background';
import { MainHeader } from './header';
import { ContextParams } from './context';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
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
  }
};

export default function RootLayout({ children, params }: { children: React.ReactNode } & ContextParams) {
  return (
    <html lang={params.lang}>
      <head />
      <body>
        <BackgroundImage />
        <MainHeader />
        <div className='container mx-auto shadow bg-neutral/70'>{children}</div>
      </body>
    </html>
  );
}

export const revalidate = 3600;
