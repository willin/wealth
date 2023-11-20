import dayjs from 'dayjs';
import clsx from 'classnames';
import {
  type LoaderFunction,
  type ActionFunction,
  json,
  redirect
} from '@remix-run/cloudflare';
import { useI18n } from 'remix-i18n';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import {
  InvoiceInCategory,
  InvoiceMethod,
  InvoiceOutCategory,
  InvoiceType
} from '~/types';
import { useState } from 'react';

export const loader: LoaderFunction = async ({ context, request, params }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(
    request,
    {
      failureRedirect: '/'
    }
  );

  if (user?.type !== 'admin') {
    return redirect('/');
  }

  if (!params.id) {
    return json({ item: {} });
  }
  const item = await context.services.invoice.getInvoice(params.id);

  return { item };
};

export const action: ActionFunction = async ({ context, request, params }) => {
  const user = await context.services.auth.authenticator.isAuthenticated(
    request,
    {
      failureRedirect: '/'
    }
  );
  if (user?.type !== 'admin') {
    return redirect('/');
  }

  const { invoice } = context.services;
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());
  if (params.id) {
    await invoice.updateInvoice(params.id, body);
    return json({});
  }
  await invoice.createInvoice(body);
  return redirect('/wallet');
};

export default function WalletInvoicePage() {
  const { t } = useI18n();
  const { item } = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  const types = [InvoiceType.OUT, InvoiceType.IN].map((x) => ({
    value: x,
    label: t(`type.${x}`)
  }));
  const inCategories = InvoiceInCategory.map((x) => ({
    value: x,
    label: t(`category.${x}`)
  }));
  const outCategories = InvoiceOutCategory.map((x) => ({
    value: x,
    label: t(`category.${x}`)
  }));
  const methods = InvoiceMethod.map((x) => ({
    value: x,
    label: t(`method.${x}`)
  }));

  const [categories, setCategories] = useState(
    item?.type === InvoiceType.IN ? inCategories : outCategories
  );

  const changeType = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as unknown as { [k: string]: string };
    setCategories(
      target.value === InvoiceType.IN ? inCategories : outCategories
    );
  };

  return (
    <>
      <Form action='.' method='POST' reloadDocument>
        {item.id && (
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>{t('invoice.id')}</span>
            </label>
            <input
              name='id'
              type='text'
              className='input input-bordered'
              disabled
              defaultValue={item.id}
            />
          </div>
        )}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>{t('invoice.category')}</span>
          </label>
          <div className='join w-full'>
            <select
              name='type'
              className='select select-bordered join-item'
              onChange={changeType}
              defaultValue={item.type || types[0].value}>
              {types.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              name='category'
              defaultValue={item.category || categories[0].value}
              className='select select-bordered join-item'>
              {categories.map(({ value, label }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>{t('invoice.amount')}</span>
          </label>
          <input
            name='amount'
            type='number'
            className='input input-bordered'
            step='.01'
            defaultValue={item.amount || ''}
          />
        </div>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>{t('invoice.method')}</span>
          </label>
          <select
            name='method'
            className='select select-bordered'
            defaultValue={item.method || methods[0].value}>
            {methods.map(({ value, label }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>{t('invoice.description')}</span>
          </label>
          <input
            name='description'
            type='text'
            placeholder='Desc / 项目说明'
            className='input input-bordered'
            defaultValue={item.description || ''}
          />
        </div>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>{t('invoice.date')}</span>
          </label>
          <input
            type='date'
            name='date'
            className={'input input-bordered'}
            defaultValue={(item.date as string) || dayjs().format('YYYY-MM-DD')}
            pattern='\d{4}-\d{2}-\d{2}'
          />
        </div>
        <div className='form-control'>
          <textarea
            name='note'
            className='textarea w-full'
            placeholder='Remark / 备注'
            defaultValue={item.note || ''}></textarea>
        </div>
        <div className='form-control w-full my-2'>
          <button
            type='submit'
            disabled={state !== 'idle'}
            className={clsx('btn btn-primary', {
              'btn-disabled': state !== 'idle'
            })}>
            {t('common.save')}
          </button>
        </div>
      </Form>
    </>
  );
}
