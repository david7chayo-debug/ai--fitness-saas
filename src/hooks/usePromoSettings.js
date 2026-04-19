import { useStorage } from './useStorage'

const DEFAULT_PROMO_SETTINGS = {
  active: true,
  text_he: 'קונים בירה — מקבלים שוט על הבית! 🥃',
  text_en: 'Buy a beer — get a free shot on us! 🥃',
  subtext_he: 'כל הלילה · בירה בלבד',
  subtext_en: 'All night · Beer only',
  color: 'gold'  // 'gold' | 'blue' | 'red'
}

export function usePromoSettings() {
  return useStorage('yosi_promo_settings', DEFAULT_PROMO_SETTINGS)
}