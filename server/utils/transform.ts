import { escape, escapeId } from 'sqlstring';
import { InvoiceIndexes, OrderDirection, type Pagination } from '~/types';

export const getPaginator = (
  params: Partial<Pagination>,
  indexes = InvoiceIndexes
): Pagination => {
  let {
    limit = 20,
    page = 1,
    direction = OrderDirection.DESC,
    order = ''
  } = params;
  // type check
  page = Number(page);
  limit = Number(limit);
  // range check
  page = page < 1 ? 1 : parseInt(page as unknown as string, 10);
  limit =
    limit < 1
      ? 1
      : limit > 1000
      ? 100
      : parseInt(limit as unknown as string, 10);
  // order by direction check
  if (!Object.values(OrderDirection).includes(direction)) {
    direction = OrderDirection.DESC;
  }
  // order by fields check
  if (!indexes.includes(order)) {
    order = indexes[0];
  }
  return { page, limit, direction, order };
};

export const buildSqlSearch = (params: any, indexes = InvoiceIndexes) => {
  let sql = '';
  Object.entries(params as { [k: string]: string }).forEach(([key, value]) => {
    if (indexes.includes(key)) {
      sql += `AND ${escapeId(key)} = ${escape(value)} `;
    }
  });
  return sql;
};
