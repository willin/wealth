import { cache } from 'react';
import 'server-only';
import { conn } from './mysql';
import { Invoice } from './types';
import { format } from 'sqlstring';

export const getInvoice = cache(async (params: Partial<Invoice>) => {
  const result = await conn.execute('SELECT * FROM invoices WHERE id = :id LIMIT 1', params);
  return result.rows?.[0];
});

export const createInvoice = async (params: Partial<Invoice>) => {
  const result = await conn.execute(format('INSERT INTO invoices SET ?', [params]));
  return result.rowsAffected === 1;
};

export const updateInvoice = async (params: Partial<Invoice>) => {
  const { id, ...updates } = params;
  if (!id || Object.keys(updates).length === 0) return false;
  const result = await conn.execute(format('UPDATE invoices SET ? WHERE id = :id LIMIT 1', [updates]), {
    id
  });
  return result.rowsAffected === 1;
};
