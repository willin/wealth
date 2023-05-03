import { ContextParams } from '@/app/[lang]/context';

export default async function Page({ params: { year: y } }: ContextParams) {
  const now = new Date();
  let year = now.getFullYear();
  if (+y >= 2023 && +y <= year) {
    year = +y;
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
