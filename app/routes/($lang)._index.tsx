import { type LoaderFunction, json, redirect } from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { i18nConfig } from '~/i18n';

export const loader: LoaderFunction = async ({ context, params }) => {
  if (params.lang && !i18nConfig.supportedLanguages.includes(params.lang)) {
    return redirect('/');
  }

  return json({});
};

export default function Index() {
  const i18n = useI18n();
  // const { sites, counter } = useLoaderData<typeof loader>();
  const { t } = i18n;

  return <div className='flex justify-center flex-col'></div>;
}
