import { i18n } from '@/i18n-config';
import { BaseURL } from '@/lib/config';

export default function sitemap() {
  // Defined Routes
  const defs = ['', '/wallet'];
  const routes = [''].concat(...i18n.locales.map((lang) => defs.map((path) => `/${lang}${path}`))).map((route) => ({
    url: `${BaseURL}${route}`,
    lastModified: new Date().toISOString().split('T')[0]
  }));

  return routes;
}
