import { useStorage } from './useStorage'

const DEFAULT_PROMO_SETTINGS = {
  active: true,
  text_he: 'קונים בירה — מקבלים שוט על הבית! 🥃',
  text_en: 'Buy a beer — get a free shot on us! 🥃',
  subtext_he: 'כל הלילה · בירה בלבד',
  subtext_en: 'All night · Beer only',
  color: 'gold'  // 'gold' | 'blue' | 'red'
}

const DEFAULT_SPECIAL_SETTINGS = {
  active: false,
  text_he: 'הלילה: קסטל טרופיקל ב-28₪ בלבד 🥭',
  text_en: 'Tonight: Kasteel Tropical only 28₪ 🥭',
}

export function usePromoSettings() {
  return useStorage('yosi_promo_settings', DEFAULT_PROMO_SETTINGS)
}

export function useSpecialSettings() {
  return useStorage('yosi_special', DEFAULT_SPECIAL_SETTINGS)
}