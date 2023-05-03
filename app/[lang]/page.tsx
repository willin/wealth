import { redirect } from 'next/navigation';
import { ContextParams } from './context';

export default function Home({ params: { lang } }: ContextParams) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return redirect(`/${lang}/${year}/${month}`);
}
