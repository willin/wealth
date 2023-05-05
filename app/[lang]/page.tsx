import { redirect } from 'next/navigation';
import { ContextParams } from './helper';

export default function Home({ params: { lang } }: ContextParams) {
  return redirect(`/${lang}/about`);
}
