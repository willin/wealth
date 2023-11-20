import { type ActionFunction } from '@remix-run/cloudflare';
import { z } from 'zod';

export const action: ActionFunction = async ({ request, context, params }) => {
  const provider = z.enum(['sso']).parse(params.provider);
  const referer = request.headers.get('referer');
  const returnPath = referer ? new URL(referer).pathname : '/';

  return await context.services.auth.authenticator.authenticate(
    provider,
    request,
    {
      successRedirect: '/wallet',
      failureRedirect: returnPath
    }
  );
};

export const loader = action;
