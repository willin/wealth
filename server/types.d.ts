import type { Env } from './env';
import type { IAuthService } from './services/auth';
import type { IInvoiceService } from './services/invoices';

declare global {
  namespace RemixServer {
    export { Env };
    export interface Services {
      auth: IAuthService;
      invoice: IInvoiceService;
    }
  }
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Env;
    CACHE: KVNamespace;
    DB: D1Database;
    services: RemixServer.Services;
  }
}
