import { escapeId } from 'sqlstring';
import { conn } from './mysql';
import { OrderStatus, Order, OrderDirection } from './types';

export const getOrders = async (
  params: {
    uid?: number;
    npm?: string;
    limit?: number;
    offset?: number;
    order?: string;
    status?: OrderStatus;
    direction?: OrderDirection;
  } = {}
) => {
  const { uid, status, npm, limit = 10, offset = 0, order = 'created_at', direction = OrderDirection.DESC } = params;
  let sql = `SELECT * FROM orders WHERE 1 = 1 `;
  if (uid) {
    sql += `AND uid = :uid `;
  }
  if (status) {
    sql += `AND status = :status `;
  }
  if (npm) {
    sql += `AND npm = :npm `;
  }
  sql += `ORDER BY ${escapeId(order)} ${direction} LIMIT :limit OFFSET :offset`;

  const result = await conn.execute(sql, {
    uid,
    status,
    npm,
    limit,
    offset
  });
  const orders: Order[] = result.rows as any;
  return orders;
};

export const countOrders = async (
  params: {
    uid?: number;
    npm?: string;
    status?: OrderStatus;
  } = {}
) => {
  const { uid, npm, status } = params;
  let sql = `SELECT COUNT(1) as count FROM orders WHERE 1 = 1 `;
  if (uid) {
    sql += `AND uid = :uid `;
  }
  if (npm) {
    sql += `AND npm = :npm `;
  }
  if (status) {
    sql += `AND status = :status `;
  }
  const result = await conn.execute(sql, {
    uid,
    npm,
    status
  });
  return ((result.rows?.[0] as { count?: number })?.count as number) || 0;
};

export const createOrder = async (params: Partial<Order>) => {
  const result = await conn.execute('INSERT INTO orders SET ?', {
    ...params,
    created_at: Math.floor(Date.now() / 1000),
    updated_at: Math.floor(Date.now() / 1000)
  });
  return result.rowsAffected === 1;
};

export const updateOrder = async (params: Partial<Order>) => {
  const { oid, status, token } = params;
  const updates: Partial<Order> = {};
  if (!status && !token) {
    return false;
  }
  if (status) {
    updates.status = status;
  }
  if (token) {
    updates.token = token;
  }
  updates.updated_at = Math.floor(Date.now() / 1000);
  const result = await conn.execute('UPDATE orders SET :updates WHERE oid = :oid LIMIT 1', {
    updates,
    oid
  });
  return result.rowsAffected === 1;
};
