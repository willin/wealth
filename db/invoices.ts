import { cache } from 'react';
import 'server-only';
import { conn } from './mysql';
import { Invoice, Pagination } from './types';
import { escapeId, format } from 'sqlstring';
import { buildSqlSearch, getPaginator } from './transform';

export const getInvoice = cache(async (params: Partial<Invoice>) => {
  const result = await conn.execute('SELECT * FROM invoices WHERE id = :id LIMIT 1', params);
  return result.rows?.[0];
});

export const getInvoices = cache(async (params: Partial<Invoice> & Pagination) => {
  const { limit, page, order, direction } = getPaginator(params);
  const sql = `SELECT * FROM invoices WHERE 1 = 1 ${buildSqlSearch(params)} ORDER BY ${escapeId(
    order
  )} ${direction} LIMIT :limit OFFSET :offset`;

  const result = await conn.execute(sql, {
    limit,
    offset: (page - 1) * limit
  });
  const invoices: Invoice[] = result.rows as any;
  return invoices;
});

export const countInvoices = cache(async (params: Partial<Invoice>) => {
  const sql = `SELECT COUNT(id) as count FROM invoices WHERE 1 = 1 ${buildSqlSearch(params)}`;
  const result = await conn.execute(sql);
  return +((result.rows?.[0] as { count?: number })?.count as number) || 0;
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
