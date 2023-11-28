import type { I18nDict } from 'remix-i18n';

export const dict: I18nDict = {
  invoice: {
    id: 'ID',
    date: 'Date',
    category: 'Category',
    amount: 'Amount',
    method: 'Payment Method',
    description: 'Description',
    note: 'Remark'
  },
  type: {
    IN: 'Income',
    OUT: 'Expenditure',
    BALANCE: 'Balance'
  },
  category: {
    MAJOR: 'Major',
    SIDE: 'Sideline',
    INVEST: 'Investment',
    DONATE: 'Donation',
    OTHERS: 'Others',
    FOOD: 'Food',
    GAME: 'Entertainment',
    STUDY: 'Knowledge',
    TRAFFIC: 'Traffic',
    RECHARGE: 'Recharge',
    DIGITAL: 'Digital',
    CLOTHES: 'Clothes',
    DAILY: 'Daily',
    FAMILY: 'Family',
    MEDICAL: 'Medical',
    OPENSOURCE: 'Open Source'
  },
  method: {
    ALIPAY: 'Alipay',
    WECHAT: 'Wechat Pay',
    CREDIT: 'Credit Card',
    BANK: 'Bank Account',
    OTHERS: 'Others'
  },
  common: {
    total: 'Total History',
    operation: 'Operation',
    edit: 'Edit',
    save: 'Save',
    all: 'All',
    login: 'Sign In',
    forbidden: 'Forbidden',
    go_back: 'Go Back',
    this_year: 'This year',
    confirm_logout: 'Are you sure to logout?',
    adblock: 'Adblock Detected',
    adblock_message: 'Please disable adblock to continue using this site.'
  },
  meta: {
    brief: 'To be Willin is to be willing.',
    intro: 'You can follow me or donate on the following platforms.',
    alipay_account: 'Fund Real Account',
    douyin: 'Douyin',
    wechat: 'Wechat Public',
    social: 'Microblog',
    yearly: 'Yearly',
    monthly: 'Monthly',
    daily: 'Daily'
  }
};
