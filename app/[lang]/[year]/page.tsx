import { ContextParams } from '@/app/[lang]/context';

export default async function Page({ params: { year: y } }: ContextParams) {
  let year = new Date().getFullYear();
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

export function generateMetadata({ params: { year } }: ContextParams) {
  return {
    title: `${year}`
  };
}
