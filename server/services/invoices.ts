import { z } from 'zod';
import type { Env } from '../env';
import type { IDatabaseService } from './database';

export interface IInvoiceService {}

export class InvoiceService implements IInvoiceService {
  #db: IDatabaseService;

  constructor(env: Env, db: IDatabaseService) {
    this.#db = db;
  }
}
