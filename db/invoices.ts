import { cache } from 'react';
import 'server-only';
import { conn } from './mysql';
import { Invoice } from './types';

export const createInvoice = async (params: Partial<Invoice>) => {
  const result = await conn.execute('INSERT INTO invoices SET ?', params);
  return result.rowsAffected === 1;
};

export const updateInvoice = async (params: Partial<Invoice>) => {
  const { id, ...updates } = params;
  if (!id) return false;
  const result = await conn.execute('UPDATE invoices SET :updates WHERE id = :id LIMIT 1', {
    updates,
    id
  });
  return result.rowsAffected === 1;
};
