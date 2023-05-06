import { cache } from 'react';
import 'server-only';
import { conn } from './mysql';
import { Invoice, InvoiceType } from './types';
import dayjs from 'dayjs';

export const getDayData = cache(async (params: { year: number; month: number; day: number }) => {
  const { year, month, day } = params;
  const sql =
    'SELECT `id`,`date`,`amount`,`type`,`category`,`desc` FROM invoices WHERE `date` >= :startdate AND `date` < :enddate ORDER BY `amount` DESC';
  const startdate = new Date(year, month - 1, day);
  const enddate = dayjs(startdate).add(1, 'day').format('YYYY-MM-DD');
  const result = await conn.execute(sql, {
    startdate,
    enddate
  });
  const invoices: Invoice[] = result.rows as any;
  return invoices;
});

export const getLastDayData = cache(async (params: { year: number; month: number; day: number }) => {
  const { year, month, day } = params;
  const sql =
    'SELECT `date`,SUM(`amount`) as `amount`,`type` FROM invoices WHERE `date` >= :startdate AND `date` < :enddate GROUP BY `date`,`type`';
  const enddate = new Date(year, month - 1, day);
  const startdate = dayjs(enddate).add(-1, 'day').format('YYYY-MM-DD');

  const result = await conn.execute(sql, {
    startdate,
    enddate
  });
  const data = { IN: 0, OUT: 0, BALANCE: 0 };
  const invoices: Invoice[] = result.rows as any;
  invoices.forEach((item) => {
    data[item.type as InvoiceType] += item.amount;
  });
  data.BALANCE = data.IN - data.OUT;
  return data;
});

export const getMonthData = cache(async (params: { year: number; month: number }) => {
  const { year, month } = params;
  const sql =
    'SELECT `date`,SUM(`amount`) as `amount`,`type`,`category` FROM invoices WHERE `date` >= :startdate AND `date` < :enddate GROUP BY `date`,`type`,`category`';
  const startdate = new Date(year, month - 1, 1);
  const enddate = new Date(year, month, 1);
  const result = await conn.execute(sql, {
    startdate,
    enddate
  });
  const invoices: Invoice[] = result.rows as any;
  return invoices;
});

export const getLastMonthData = cache(async (params: { year: number; month: number }) => {
  const { year, month } = params;
  const sql =
    "SELECT DATE_FORMAT(`date`, '%Y-%m') as `month`,SUM(`amount`) as `amount`,`type` FROM invoices WHERE `date` >= :startdate AND `date` < :enddate GROUP BY `month`,`type`";
  const enddate = new Date(year, month - 1, 1);
  const startdate = dayjs(enddate).add(-1, 'month').format('YYYY-MM-DD');
  const result = await conn.execute(sql, {
    startdate,
    enddate
  });
  const data = { IN: 0, OUT: 0, BALANCE: 0 };
  const invoices: Invoice[] = result.rows as any;
  invoices.forEach((item) => {
    data[item.type as InvoiceType] += item.amount;
  });
  data.BALANCE = data.IN - data.OUT;
  return data;
});

export const getYearData = cache(async (params: { year: number }) => {
  const { year } = params;
  const sql =
    "SELECT DATE_FORMAT(`date`, '%Y-%m') as `date`,SUM(`amount`) as `amount`,`type`,`category` FROM invoices WHERE `date` >= :startdate AND `date` < :enddate GROUP BY DATE_FORMAT(`date`, '%Y-%m'),`type`,`category`";
  const startdate = new Date(year, 0, 1);
  const enddate = new Date(year + 1, 0, 1);
  const result = await conn.execute(sql, {
    startdate,
    enddate
  });
  const invoices: Invoice[] = result.rows as any;
  return invoices;
});

export const getLastYearData = cache(async (params: { year: number }) => {
  const { year } = params;
  const sql =
    "SELECT DATE_FORMAT(`date`, '%Y') as `year`,SUM(`amount`) as `amount`,`type` FROM invoices WHERE `date` >= :startdate AND `date` < :enddate GROUP BY `year`,`type`";
  const startdate = new Date(year - 1, 0, 1);
  const enddate = new Date(year, 0, 1);
  const result = await conn.execute(sql, {
    startdate,
    enddate
  });
  const data = { IN: 0, OUT: 0, BALANCE: 0 };
  const invoices: Invoice[] = result.rows as any;
  invoices.forEach((item) => {
    data[item.type as InvoiceType] += item.amount;
  });
  data.BALANCE = data.IN - data.OUT;
  return data;
});

export const getTotalData = async () => {
  const sql = 'SELECT SUM(`amount`) as `amount`,`type` FROM invoices GROUP BY `type`';
  const result = await conn.execute(sql);
  const data = { IN: 0, OUT: 0, BALANCE: 0 };
  const invoices: Invoice[] = result.rows as any;
  invoices.forEach((item) => {
    data[item.type as InvoiceType] += item.amount;
  });
  data.BALANCE = data.IN - data.OUT;
  return data;
};
