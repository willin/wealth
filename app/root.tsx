import styles from './tailwind.css';
import {
  json,
  redirect,
  type LinksFunction,
  type LoaderFunction
} from '@remix-run/cloudflare';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import { ThemeProvider } from './components/use-theme';
import { useI18n } from 'remix-i18n';
import DetectLanguage from './components/detect-lang';
import Layout from './components/layout';
import { themeCookie } from './cookie.server';
import { defaultLightTheme } from './themes';
import { i18nConfig } from './i18n';

export const meta: MetaFunction = () => {
  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Willin Wang Wallet' },
    { name: 'description', content: "A Willin Wang's Work" },
    {
      name: 'keywords',
      content: ['Next.js', 'React', 'JavaScript', 'Willin Wang'].join(', ')
    },
    { name: 'author', content: 'Willin Wang' },
    { name: 'apple-touch-fullscreen', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'theme-color', content: '#FF8E05' }
  ];
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/ico' },
  { rel: 'icon', href: '/favicon.png', type: 'image/png' },
  { rel: 'manifest', href: '/manifest.json' }
];

export const loader: LoaderFunction = async ({ request, context, params }) => {
  if (params.lang && !i18nConfig.supportedLanguages.includes(params.lang)) {
    return redirect('/');
  }
  const url = new URL(request.url);
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    throw redirect(request.url.slice(0, -1), {
      status: 308
    });
  }
  const theme =
    (await themeCookie.parse(request.headers.get('Cookie'))) ||
    defaultLightTheme;
  const user =
    await context.services.auth.authenticator.isAuthenticated(request);

  return json({ theme, user });
};

export default function App() {
  const { theme } = useLoaderData<typeof loader>();
  const i18n = useI18n();

  return (
    <ThemeProvider specifiedTheme={theme}>
      <html lang={i18n.locale()} data-theme={theme}>
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <Layout>
            <Outlet />
          </Layout>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <DetectLanguage />
        </body>
      </html>
    </ThemeProvider>
  );
}
