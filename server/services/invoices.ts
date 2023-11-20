import dayjs from 'dayjs';
import { buildSqlSearch, getPaginator } from 'server/utils/transform';
import type { Env } from '../env';
import type { IDatabaseService } from './database';
import type { InOutBalance, Invoice, InvoiceType, Pagination } from '~/types';
import { escapeId } from 'sqlstring';

export interface IInvoiceService {
  // Public
  getDayData(params: {
    year: number;
    month: number;
    day: number;
  }): Promise<Invoice[]>;
  getLastDayData(params: {
    year: number;
    month: number;
    day: number;
  }): Promise<InOutBalance>;
  getMonthData(params: { year: number; month: number }): Promise<Invoice[]>;
  getLastMonthData(params: {
    year: number;
    month: number;
  }): Promise<InOutBalance>;
  getYearData(params: { year: number }): Promise<Invoice[]>;
  getLastYearData(params: { year: number }): Promise<InOutBalance>;
  getTotalData(): Promise<InOutBalance>;
  // Manage
  getInvoice(id: string): Promise<Invoice>;
  getInvoices(prams: Partial<Invoice> & Pagination): Promise<Invoice[]>;
  countInvoices(prams: Partial<Invoice> & Pagination): Promise<number>;
  createInvoice(params: Partial<Invoice>): Promise<boolean>;
  updateInvoice(id: string, params: Partial<Invoice>): Promise<boolean>;
}

export class InvoiceService implements IInvoiceService {
  #db: IDatabaseService;

  constructor(env: Env, db: IDatabaseService) {
    this.#db = db;
  }
  // Public
  getDayData(params: {
    year: number;
    month: number;
    day: number;
  }): Promise<Invoice[]> {
    const { year, month, day } = params;
    const sql =
      'SELECT `id`,`date`,`amount`,`type`,`category`,`desc` FROM invoices WHERE `date` >= ?1 AND `date` < ?2 ORDER BY `amount` DESC';
    const startdate = new Date(year, month - 1, day);
    const enddate = dayjs(startdate).add(1, 'day').format('YYYY-MM-DD');
    return this.#db.query<Invoice>(sql, [
      dayjs(startdate).format('YYYY-MM-DD'),
      enddate
    ]);
  }

  async getLastDayData(params: {
    year: number;
    month: number;
    day: number;
  }): Promise<InOutBalance> {
    const { year, month, day } = params;
    const sql =
      'SELECT `date`,SUM(`amount`) as `amount`,`type` FROM invoices WHERE `date` >= ?1 AND `date` < ?2 GROUP BY `date`,`type`';
    const enddate = new Date(year, month - 1, day);
    const startdate = dayjs(enddate).add(-1, 'day').format('YYYY-MM-DD');
    const records = await this.#db.query<Invoice>(sql, [
      startdate,
      dayjs(enddate).format('YYYY-MM-DD')
    ]);
    const data = { IN: 0, OUT: 0, BALANCE: 0 };
    records.forEach((item) => {
      data[item.type as InvoiceType] += item.amount;
    });
    data.BALANCE = data.IN - data.OUT;
    return data;
  }

  getMonthData(params: { year: number; month: number }): Promise<Invoice[]> {
    const { year, month } = params;
    const sql =
      'SELECT `date`,SUM(`amount`) as `amount`,`type`,`category` FROM invoices WHERE `date` >= ?1 AND `date` < ?2 GROUP BY `date`,`type`,`category`';
    const startdate = new Date(year, month - 1, 1);
    const enddate = new Date(year, month, 1);
    return this.#db.query<Invoice>(sql, [
      dayjs(startdate).format('YYYY-MM-DD'),
      dayjs(enddate).format('YYYY-MM-DD')
    ]);
  }

  async getLastMonthData(params: {
    year: number;
    month: number;
  }): Promise<InOutBalance> {
    const { year, month } = params;
    const sql =
      'SELECT substr(`date`,0,8) as `month`,SUM(`amount`) as `amount`,`type` FROM invoices WHERE `date` >= ?1 AND `date` < ?2 GROUP BY `month`,`type`';
    const enddate = new Date(year, month - 1, 1);
    const startdate = dayjs(enddate).add(-1, 'month').format('YYYY-MM-DD');
    const records = await this.#db.query<Invoice>(sql, [
      startdate,
      dayjs(enddate).format('YYYY-MM-DD')
    ]);
    const data = { IN: 0, OUT: 0, BALANCE: 0 };
    records.forEach((item) => {
      data[item.type as InvoiceType] += item.amount;
    });
    data.BALANCE = data.IN - data.OUT;
    return data;
  }

  getYearData(params: { year: number }): Promise<Invoice[]> {
    const { year } = params;
    const sql =
      'SELECT substr(`date`,0,8) as `date`,SUM(`amount`) as `amount`,`type`,`category` FROM invoices WHERE `date` >= ?1 AND `date` < ?2 GROUP BY substr(`date`,0,8),`type`,`category`';
    const startdate = new Date(year, 0, 1);
    const enddate = new Date(year + 1, 0, 1);
    return this.#db.query<Invoice>(sql, [
      dayjs(startdate).format('YYYY-MM-DD'),
      dayjs(enddate).format('YYYY-MM-DD')
    ]);
  }

  async getLastYearData(params: { year: number }): Promise<InOutBalance> {
    const { year } = params;
    const sql =
      'SELECT substr(`date`,0,5) as `year`,SUM(`amount`) as `amount`,`type` FROM invoices WHERE `date` >= ?1 AND `date` < ?2 GROUP BY `year`,`type`';
    const startdate = new Date(year - 1, 0, 1);
    const enddate = new Date(year, 0, 1);
    const records = await this.#db.query<Invoice>(sql, [
      dayjs(startdate).format('YYYY-MM-DD'),
      dayjs(enddate).format('YYYY-MM-DD')
    ]);

    const data = { IN: 0, OUT: 0, BALANCE: 0 };
    records.forEach((item) => {
      data[item.type as InvoiceType] += item.amount;
    });
    data.BALANCE = data.IN - data.OUT;
    return data;
  }

  async getTotalData(): Promise<InOutBalance> {
    const records = await this.#db.query<Invoice>(
      'SELECT SUM(`amount`) as `amount`,`type` FROM invoices GROUP BY `type`'
    );
    const data = { IN: 0, OUT: 0, BALANCE: 0 };
    records.forEach((item) => {
      data[item.type as InvoiceType] += item.amount;
    });
    data.BALANCE = data.IN - data.OUT;
    return data;
  }

  // Manage
  getInvoice(id: string): Promise<Invoice> {
    return this.#db
      .query<Invoice>('SELECT * FROM invoices WHERE id = :id LIMIT 1', [id])
      .then((records) => records?.[0]);
  }

  getInvoices(params: Partial<Invoice> & Pagination): Promise<Invoice[]> {
    const { limit, page, order, direction } = getPaginator(params);
    const sql = `SELECT * FROM invoices WHERE 1 = 1 ${buildSqlSearch(
      params
    )} ORDER BY ${escapeId(order)} ${direction} LIMIT ?1 OFFSET ?2`;
    return this.#db.query<Invoice>(sql, [limit, (page - 1) * limit]);
  }

  countInvoices(params: Partial<Invoice> & Pagination): Promise<number> {
    const sql = `SELECT COUNT(id) as count FROM invoices WHERE 1 = 1 ${buildSqlSearch(
      params
    )}`;
    return this.#db.query(sql).then((records) => records?.[0]?.count || 0);
  }

  createInvoice(params: Partial<Invoice>): Promise<boolean> {
    return this.#db.execute(
      'INSERT INTO invoices(type, date, category, amount, method, note, description) VALUES (?1,?2,?3,?4,?5,?6,?7)',
      [
        params.type,
        params.date,
        params.category,
        params.amount,
        params.method,
        params.note,
        params.description
      ]
    );
  }

  updateInvoice(id: string, params: Partial<Invoice>): Promise<boolean> {
    return this.#db.execute(
      'UPDATE invoices SET type=?2, date=?3, category=?4, amount=?5, method=?6, note=?7, description=?8 WHERE id = ?1',
      [
        id,
        params.type,
        params.date,
        params.category,
        params.amount,
        params.method,
        params.note,
        params.description
      ]
    );
  }
}
