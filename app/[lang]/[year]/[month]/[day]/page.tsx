import { ContextParams } from '@/app/[lang]/helper';
import { redirect } from 'next/navigation';

export default async function Page({ params: { year, month, day } }: ContextParams) {
  const date = new Date(+year, +month - 1, +day);
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

export function generateMetadata({ params: { year, month, day } }: ContextParams) {
  return {
    title: `${year}-${`${month}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`
  };
}
