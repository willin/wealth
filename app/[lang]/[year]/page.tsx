import { ContextParams } from '@/app/[lang]/helper';
import { redirect } from 'next/navigation';

export default async function Page({ params: { year } }: ContextParams) {
  const date = new Date(+year, 0, 1);
  if (date.toString() === 'Invalid Date') {
    return redirect('/');
  }

  return (
    <div>
      <h1>{year}</h1>
      <h2>{typeof year}</h2>
    </div>
  );
}

export function generateMetadata({ params: { year } }: ContextParams) {
  return {
    title: `${year}`
  };
}
