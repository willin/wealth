export const InvoiceInCategory = [
  // 投资理财
  'INVEST',
  // 主业
  'MAJOR',
  // 副业
  'SIDE',
  // 红包打赏
  'DONATE',
  // 其他
  'OTHERS'
];

export const InvoiceOutCategory = [
  // 餐饮
  'FOOD',
  // 娱乐
  'GAME',
  // 学习提升
  'STUDY',
  // 交通
  'TRAFFIC',
  // 充值
  'RECHARGE',
  // 数码
  'DIGITAL',
  // 服饰
  'CLOTHES',
  // 日用
  'DAILY',
  // 家庭
  'FAMILY',
  // 医疗
  'MEDICAL',
  // 红包打赏
  'DONATE',
  // 开源公益
  'OPENSOURCE',
  // 其他
  'OTHERS'
];

export const InvoiceMethod = [
  // 支付宝
  'ALIPAY',
  // 微信
  'WECHAT',
  // 信用卡
  'CREDIT',
  // 银行卡
  'BANK',
  // 其他账户
  'OTHERS'
];

export enum InvoiceType {
  IN = 'IN',
  OUT = 'OUT'
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface Pagination {
  limit: number;
  page: number;
  order: string;
  direction: OrderDirection;
}

export interface Invoice {
  id?: number;
  type: InvoiceType | string;
  date: Date | string;
  category: InvoiceInCategory | InvoiceOutCategory | string;
  amount: number;
  method: InvoiceMethod | string;
  description: string;
  note: string;
}

export interface InOutBalance {
  IN: number;
  OUT: number;
  BALANCE: number;
}

export const InvoiceIndexes = ['date', 'type', 'category', 'amount', 'id'];

export function formatMoney(n: number) {
  return n.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' });
}
