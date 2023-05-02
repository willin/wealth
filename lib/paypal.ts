const BASE = process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const SECRET = process.env.PAYPAL_SECRET || '';

const cache: { token: string; expires: number } = {
  token: '',
  expires: 0
};

export const getPaypalToken = async () => {
  if (Date.now() < cache.expires) {
    return cache.token;
  }
  const result = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${SECRET}`)}`
    },
    body: `grant_type=client_credentials`
  });
  const { access_token, expires_in }: { access_token: string; expires_in: number } = await result.json();
  cache.token = access_token;
  cache.expires = Date.now() + expires_in * 1000;
  return access_token;
};

export const createPayment = async () => {
  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: 'http://return.url',
      cancel_url: 'http://cancel.url'
    },
    note_to_payer: 'test',
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'item',
              sku: 'item',
              price: '1.00',
              currency: 'USD',
              quantity: 1
            }
          ]
        },
        amount: {
          currency: 'USD',
          total: '1.00'
        },
        custom: 'EBAY_EMS_90048630024435',
        invoice_number: '48787589673',
        description: 'This is the payment description.'
      }
    ]
  };
  const result = await fetch(`${BASE}/v1/payments/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${await getPaypalToken()}`
    },
    body: JSON.stringify(create_payment_json)
  });
  const data = await result.json();
  console.log('------------------');
  console.log(JSON.stringify(data, null, 2));
  console.log('------------------');
};

export const executePayment = async (paymentId: string, payerId: string) => {
  // paymentId=PAYID-MREQAPY771746280W956263L&token=EC-20F17850LR995223C&PayerID=64HYB9BLWRBVL
  const result = await fetch(`${BASE}/v1/payments/payment/${paymentId}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${await getPaypalToken()}`
    },
    body: JSON.stringify({ payer_id: payerId })
  });
  const data = await result.json();
  console.log('------------------');
  console.log(JSON.stringify(data, null, 2));
  console.log('------------------');
};
