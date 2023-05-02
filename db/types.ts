export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum PaidType {
  ONCE = 'ONCE',
  SUBCRIBE = 'SUBCRIBE'
}

export enum PaymentMethod {
  PAYPAL = 'PAYPAL'
}

export interface Package {
  uid: number;
  npm: string;
  // 100 = 1.00 USD
  price: number;
  type: PaidType;
  created_at: number;
  updated_at: number;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  CLOSED = 'CLOSED'
}

export interface Order {
  oid: string;
  uid: number;
  npm: string;
  // 100 = 1.00 USD
  fee: number;
  // 0: forever, or N months
  amount: number;
  method: PaymentMethod;
  status: OrderStatus;
  token: string;
  created_at: number;
  updated_at: number;
}

export interface Token {
  token: string;
  uid: number;
  npm: string;
  // 0: forever, 1: disabled, or unix timestamp
  expired_at: number;
  created_at: number;
  updated_at: number;
}

export interface User {
  uid: number;
  username: string;
  email: string;
  // 100 = 1.00 USD
  balance: number;
  created_at: number;
  updated_at: number;
}
