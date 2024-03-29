import type { I18nDict } from 'remix-i18n';

export const dict: I18nDict = {
  invoice: {
    id: 'ID',
    date: '日期',
    category: '分类',
    amount: '金额',
    method: '支付方式',
    description: '项目说明',
    note: '备注'
  },
  type: {
    IN: '收入',
    OUT: '支出',
    BALANCE: '结余'
  },
  category: {
    MAJOR: '主业收入',
    SIDE: '副业收入',
    INVEST: '投资理财',
    DONATE: '红包打赏',
    OTHERS: '其他',
    FOOD: '餐饮美食',
    GAME: '休闲娱乐',
    STUDY: '学习提升',
    TRAFFIC: '交通出行',
    RECHARGE: '充值缴费',
    DIGITAL: '数码电器',
    CLOTHES: '服饰装扮',
    DAILY: '日用百货',
    FAMILY: '家庭',
    MEDICAL: '医疗健康',
    OPENSOURCE: '开源/服务'
  },
  method: {
    ALIPAY: '支付宝',
    WECHAT: '微信',
    CREDIT: '信用卡',
    BANK: '银行账户',
    OTHERS: '其他'
  },
  common: {
    total: '历史总计',
    operation: '操作',
    edit: '编辑',
    save: '保存',
    all: '全部',
    login: '管理员登录',
    forbidden: '禁止访问',
    go_back: '返回',
    this_year: '今年',
    confirm_logout: '确定要退出登录吗？',
    adblock: '发现广告拦截插件',
    adblock_message: '请关闭广告拦截插件以继续使用本站服务。'
  },
  meta: {
    brief: '人生最大的冒险就是不冒险。',
    intro: '您可以在以下平台关注我，或进行打赏。',
    alipay_account: '基金实盘',
    douyin: '抖音号',
    wechat: '微信公众号',
    social: '微博客',
    yearly: '年视图',
    monthly: '月视图',
    daily: '日视图'
  }
};
