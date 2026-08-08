export type PromotionCategory = 'bank' | 'insurance' | 'capital' | 'infra'

export interface Promotion {
  id: string
  company: string
  title: string
  desc: string
  category: PromotionCategory
  urgencyLabel?: string
  backgroundImage?: string
}

export const categoryColor: Record<PromotionCategory, string> = {
  bank: '#f3e8dc',
  insurance: '#dbe8f7',
  capital: '#e3f0e0',
  infra: '#eee2f2',
}

export const categoryGradient: Record<PromotionCategory, string> = {
  bank: 'linear-gradient(135deg, #fdf6ea, #f3e8dc)',
  insurance: 'linear-gradient(135deg, #f0f6fd, #dbe8f7)',
  capital: 'linear-gradient(135deg, #f2f8f0, #e3f0e0)',
  infra: 'linear-gradient(135deg, #f8f2fa, #eee2f2)',
}

export const categoryAccent: Record<PromotionCategory, string> = {
  bank: '#8a6d4d',
  insurance: '#4a6d94',
  capital: '#4f7a52',
  infra: '#7a5c85',
}

export const initialPromotions: Promotion[] = [
  { id: 'p1', company: 'بانک آینده', title: 'تسهیلات ویژه‌ی نمایشگاهی', desc: 'با نرخ سود ویژه برای کسب‌وکارهای کوچک', category: 'bank', urgencyLabel: '⏱ تا پایان امروز' },
  { id: 'p2', company: 'بیمه دانا', title: '۲۰٪ تخفیف بیمه‌نامه', desc: 'فقط برای بازدیدکنندگان نمایشگاه بانیان', category: 'insurance' },
  { id: 'p3', company: 'کارگزاری مفید', title: 'افتتاح حساب رایگان', desc: 'بدون کارمزد تا پایان سال', category: 'capital' },
]