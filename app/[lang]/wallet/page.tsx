import { Locale } from '@/i18n-config';
import { translation } from '@/lib/i18n';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth';
import Error from './error';

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const t = await translation(lang);
  const session = await getServerSession(authOptions);
  if (!session) {
    return <Error lang={lang} goBack={t('error.go_back')} forbidden={t('error.forbidden')} />;
  }

  return (
    <div>
      <h2>
        {t('invoice.date')} {JSON.stringify(session)}
      </h2>
    </div>
  );
}
