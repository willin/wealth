import { escapeId } from 'sqlstring';
import { conn } from './mysql';
import { OrderDirection, Package, PaidType } from './types';

export const getPackages = async (
  params: {
    uid?: number;
    limit?: number;
    offset?: number;
    order?: string;
    type?: PaidType;
    direction?: OrderDirection;
  } = {}
) => {
  const { uid, type, limit = 10, offset = 0, order = 'created_at', direction = OrderDirection.DESC } = params;
  let sql = `SELECT * FROM packages WHERE 1 = 1 `;
  if (uid) {
    sql += `AND uid = :uid `;
  }
  if (type) {
    sql += `AND type = :type `;
  }
  sql += `ORDER BY ${escapeId(order)} ${direction} LIMIT :limit OFFSET :offset`;

  const result = await conn.execute(sql, {
    uid,
    type,
    limit,
    offset
  });
  const packages: Package[] = result.rows as any;
  return packages;
};

export const countPackages = async (
  params: {
    uid?: number;
    type?: PaidType;
  } = {}
) => {
  const { uid, type } = params;
  let sql = `SELECT COUNT(1) as count FROM packages WHERE 1 = 1 `;
  if (uid) {
    sql += `AND uid = :uid `;
  }
  if (type) {
    sql += `AND type = :type `;
  }
  const result = await conn.execute(sql, {
    uid,
    type
  });
  return ((result.rows?.[0] as { count?: number })?.count as number) || 0;
};

export const createPackage = async (params: Partial<Package>) => {
  const result = await conn.execute('INSERT INTO packages SET ?', {
    ...params,
    created_at: Math.floor(Date.now() / 1000),
    updated_at: Math.floor(Date.now() / 1000)
  });
  return result.rowsAffected === 1;
};

export const updatePackage = async (params: Partial<Package>) => {
  const { npm, price, type } = params;
  const updates: Partial<Package> = {};
  if (!price && !type) {
    return false;
  }
  if (price) {
    updates.price = price;
  }
  if (type) {
    updates.type = type;
  }
  updates.updated_at = Math.floor(Date.now() / 1000);
  const result = await conn.execute('UPDATE packages SET :updates WHERE npm = :npm LIMIT 1', {
    updates,
    npm
  });
  return result.rowsAffected === 1;
};

export const deletePackage = async (params: { npm: string }) => {
  const { npm } = params;
  const result = await conn.execute('DELETE FROM packages WHERE npm = :npm LIMIT 1', { npm });
  return result.rowsAffected === 1;
};
