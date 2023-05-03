import { getServerSession } from 'next-auth';
import { translation } from '@/lib/i18n';
import { Locale } from '@/i18n-config';
import { authOptions } from '@/lib/next-auth';
import Form from '../form';
import Error from '../error';

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
  const t = await translation(lang);
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <Error lang={lang} goBack={t('common.go_back')} forbidden={t('common.forbidden')} login={t('common.login')} />
    );
  }
  return <Form />;
}
