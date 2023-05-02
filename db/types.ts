export enum InvoiceInCategory {
  // 主业
  MAJOR = 'MAJOR',
  // 副业
  SDIE = 'SIDE',
  // 投资理财
  INVEST = 'INVEST',
  // 红包打赏
  DONATE = 'DONATE',
  // 其他
  OTHERS = 'OTHERS'
}

export enum InvoiceOutCategory {
  // 餐饮
  FOOD = 'FOOD',
  // 娱乐
  GAME = 'GAME',
  // 学习提升
  STUDY = 'STUDY',
  // 交通
  TRAFFIC = 'TRAFFIC',
  // 充值
  RECHARGE = 'RECHARGE',
  // 数码
  DIGITAL = 'DIGITAL',
  // 服饰
  CLOTHES = 'CLOTHES',
  // 日用
  DAILY = 'DAILY',
  // 家庭
  FAMILY = 'FAMILY',
  // 医疗
  MEDICAL = 'MEDICAL',
  // 红包打赏
  DONATE = 'DONATE',
  // 其他
  OTHERS = 'OTHERS'
}

export enum InvoiceMethod {
  // 支付宝
  ALIPAY = 'ALIPAY',
  // 微信
  WECHAT = 'WECHAT',
  // 信用卡
  CREDIT = 'CREDIT',
  // 银行卡
  BANK = 'BANK',
  // 其他账户
  OTHERS = 'OTHERS'
}

export enum InvoiceType {
  IN = 'IN',
  OUT = 'OUT'
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface Invoice {
  id: number;
  type: InvoiceType;
  date: Date;
  category: InvoiceInCategory | InvoiceOutCategory;
  amount: number;
  method: InvoiceMethod;
  desc: string;
  note: string;
}
