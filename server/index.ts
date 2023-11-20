import { logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';
import { EnvSchema } from './env';
import { AuthService } from './services/auth';
import { InvoiceService } from './services/invoices';
import { D1Provider } from './provider/d1.db';
import { DatabaseService } from './services/database';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: async (ctx) => {
    const env = EnvSchema.parse(ctx.env);

    const url = new URL(ctx.request.url);
    // Init Providers
    const dbProvider = new D1Provider(ctx.env.DB);
    // Init Services
    const db = new DatabaseService(dbProvider);
    // Inject Main Services
    const auth = new AuthService(env, url);
    const invoice = new InvoiceService(env, db);
    const services: RemixServer.Services = {
      auth,
      invoice
    };
    return { env, services };
  },
  mode: build.mode
});
