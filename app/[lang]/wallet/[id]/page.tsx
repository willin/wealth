import { translation } from '@/lib/i18n';
import { Locale } from '@/i18n-config';
import { InvoiceInCategory, InvoiceMethod, InvoiceOutCategory, InvoiceType } from '@/db/types';
import Form from '../form';

export default async function Page({ params: { lang, id } }: { params: { lang: Locale; id: string | number } }) {
  const t = await translation(lang);

  const inCategories = InvoiceInCategory.map((x) => ({ value: x, label: t(`category.${x}`) }));
  const outCategories = InvoiceOutCategory.map((x) => ({ value: x, label: t(`category.${x}`) }));
  const methods = InvoiceMethod.map((x) => ({ value: x, label: t(`method.${x}`) }));
  const types = [InvoiceType.IN, InvoiceType.OUT].map((x) => ({ value: x, label: t(`type.${x}`) }));

  return (
    <div className='flex justify-center'>
      <div className='w-full max-w-2xl'>
        <Form
          id={+id}
          inCategories={inCategories}
          outCategories={outCategories}
          types={types}
          methods={methods}
          locale={lang}
        />
      </div>
    </div>
  );
}
