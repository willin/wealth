import { cache } from 'react';
import 'server-only';
import { escapeId } from 'sqlstring';
import { customAlphabet } from 'nanoid';
import { conn } from './mysql';
import { Token, OrderDirection } from './types';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 32);

export const getToken = cache(async (params: { token: string; npm: string }) => {
  const { token, npm } = params;
  const result = await conn.execute(`SELECT * FROM tokens WHERE token = :token AND npm = :npm LIMIT 1`, {
    token,
    npm
  });
  const tokens: Token[] = result.rows as any;
  return tokens?.[0];
});

export const getTokens = async (
  params: {
    uid?: number;
    limit?: number;
    offset?: number;
    order?: string;
    direction?: OrderDirection;
  } = {}
) => {
  const { uid, limit = 10, offset = 0, order = 'created_at', direction = OrderDirection.DESC } = params;
  let sql = `SELECT * FROM tokens WHERE 1 = 1 `;
  if (uid) {
    sql += `AND uid = :uid `;
  }
  sql += `ORDER BY ${escapeId(order)} ${direction} LIMIT :limit OFFSET :offset`;

  const result = await conn.execute(sql, {
    uid,
    limit,
    offset
  });
  const tokens: Token[] = result.rows as any;
  return tokens;
};

export const countTokens = async (
  params: {
    uid?: number;
  } = {}
) => {
  const { uid } = params;
  let sql = `SELECT COUNT(1) as count FROM tokens WHERE 1 = 1 `;
  if (uid) {
    sql += `AND uid = :uid `;
  }
  const result = await conn.execute(sql, {
    uid
  });
  return ((result.rows?.[0] as { count?: number })?.count as number) || 0;
};

export const createToken = async (params: Partial<Token>): Promise<boolean> => {
  try {
    const result = await conn.execute('INSERT INTO tokens SET ?', {
      ...params,
      token: nanoid(),
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000)
    });
    return result.rowsAffected === 1;
  } catch (e) {
    if (((e as any as { message: string }).message || '').includes('Duplicate entry')) {
      return createToken(params);
    }
    throw e;
  }
};

export const updateToken = async (params: Partial<Token>) => {
  const { token, expired_at } = params;
  const updates: Partial<Token> = {};
  if (!expired_at && !token) {
    return false;
  }
  if (expired_at) {
    updates.expired_at = expired_at;
  }
  updates.updated_at = Math.floor(Date.now() / 1000);
  const result = await conn.execute('UPDATE tokens SET :updates WHERE token = :token LIMIT 1', {
    updates,
    token
  });
  return result.rowsAffected === 1;
};
