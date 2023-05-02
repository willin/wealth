'use client'; // Error components must be Client components
import Link from 'next/link';

export default function Error({ lang, goBack, forbidden }: { [k: string]: string }) {
  return (
    <div>
      <h2>{forbidden}</h2>
      <Link href={`/${lang}`}>{goBack}</Link>
    </div>
  );
}
