import { useState, useMemo, useEffect } from 'react'
import { theme } from '../theme'
import { PRODUCTS } from '../data/products'

const PROMO_TYPES = {
  BUY_GET: 'buy_get',
  DISCOUNT: 'discount',
  CONDITIONAL: 'conditional',
  HAPPY_HOUR: 'happy_hour'
}

const VERDICT_COLORS = {
  GREEN: '#2A7A2A',
  YELLOW: '#C8922A',
  RED: '#B22222'
}

function StepIndicator({ currentStep, completedSteps }) {
  const steps = [
    { label: 'הגדרת הפרומו', en: 'Define Promo' },
    { label: 'ניתוח כלכלי', en: 'Financial Analysis' },
    { label: 'פסיקה', en: 'Verdict' }
  ]

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 32 }}>
      {steps.map((step, index) => {
        const stepNum = index + 1
        const isActive = stepNum === currentStep
        const isCompleted = completedSteps.includes(stepNum)

        return (
          <div key={stepNum} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isActive ? theme.gold : isCompleted ? theme.gold : theme.warmGray,
              color: isActive || isCompleted ? theme.bg : theme.stone,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              transition: 'all 0.3s ease'
            }}>
              {isCompleted ? '✓' : stepNum}
            </div>
            <div style={{
              fontSize: 12,
              color: isActive ? theme.gold : theme.warmGray,
              fontWeight: isActive ? 700 : 400
            }}>
              {step.label}
              <div style={{ fontSize: 10, color: theme.warmGray }}>{step.en}</div>
            </div>
            {index < steps.length - 1 && (
              <div style={{
                width: 40,
                height: 2,
                background: isCompleted ? theme.gold : theme.warmGray,
                margin: '0 8px'
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ProductSelector({ label, value, onChange, lang }) {
  const isHe = lang === 'he'

  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: theme.warmGray, marginBottom: 8, fontWeight: 700 }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: theme.cardDeep,
          border: `1px solid ${theme.accent}`,
          color: theme.stone,
          borderRadius: 6,
          padding: '12px',
          fontSize: 14,
          fontFamily: "'Frank Ruhl Libre', serif",
          fontWeight: 700,
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <option value="">{isHe ? 'בחר מוצר...' : 'Select product...'}</option>
        {PRODUCTS.map(product => (
          <option key={product.id} value={product.id}>
            {isHe ? product.name_he : product.name_en} — {product.price}₪ | {isHe ? 'עלות' : 'cost'}: {product.cost}₪
          </option>
        ))}
      </select>
    </label>
  )
}

function NumberInput({ label, value, onChange, prefix, suffix, min = 0, step = 1 }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: theme.warmGray, marginBottom: 4, fontWeight: 700 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {prefix && <span style={{ fontSize: 13, color: theme.warmGray }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            flex: 1,
            background: theme.cardDeep,
            border: `1px solid ${theme.accent}`,
            color: theme.stone,
            borderRadius: 6,
            padding: '12px',
            fontSize: 15,
            fontFamily: "'Frank Ruhl Libre', serif",
            fontWeight: 700,
            outline: 'none',
            min: min,
            step: step
          }}
        />
        {suffix && <span style={{ fontSize: 13, color: theme.warmGray }}>{suffix}</span>}
      </div>
    </label>
  )
}

function Toggle({ label, value, onChange, options }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: theme.warmGray, marginBottom: 8, fontWeight: 700 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              flex: 1,
              background: value === option.value ? theme.gold : theme.cardDeep,
              border: `1px solid ${value === option.value ? theme.gold : theme.accent}`,
              color: value === option.value ? theme.bg : theme.stone,
              borderRadius: 6,
              padding: '12px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </label>
  )
}

function Slider({ label, value, onChange, min = 0, max = 100, step = 1 }) {
  const labels = [
    { value: 0, label: 'לעולם לא' },
    { value: 25, label: 'נמוכה' },
    { value: 50, label: 'בינונית' },
    { value: 75, label: 'גבוהה' },
    { value: 100, label: 'תמיד' }
  ]

  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: theme.warmGray, marginBottom: 8, fontWeight: 700 }}>{label}</div>
      <input
        type="range"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        style={{
          width: '100%',
          height: 6,
          background: theme.cardDeep,
          borderRadius: 3,
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {labels.map(label => (
          <span key={label.value} style={{
            fontSize: 10,
            color: value >= label.value - 12.5 && value <= label.value + 12.5 ? theme.gold : theme.warmGray
          }}>
            {label.label}
          </span>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: 14, color: theme.stone, marginTop: 8 }}>
        {value}%
      </div>
    </label>
  )
}

function ReceiptBreakdown({ items }) {
  return (
    <div style={{
      background: theme.cardDeep,
      border: `1px solid ${theme.accent}`,
      borderRadius: 8,
      padding: 16,
      fontFamily: 'monospace',
      fontSize: 14
    }}>
      {items.map((item, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '4px 0',
          borderBottom: item.separator ? `1px solid ${theme.accent}` : 'none',
          fontWeight: item.bold ? 700 : 400,
          color: item.color || theme.stone
        }}>
          <span>{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function VerdictCard({ verdict, explanation, monthlyNet, lang }) {
  const isHe = lang === 'he'
  const color = VERDICT_COLORS[verdict.color]

  return (
    <div style={{
      background: theme.card,
      border: `3px solid ${color}`,
      borderRadius: 8,
      padding: 20,
      marginBottom: 20
    }}>
      <div style={{ fontSize: 24, marginBottom: 12 }}>{verdict.emoji} {verdict.headline}</div>
      <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{explanation}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: theme.gold }}>
        {isHe ? 'בחודש זה שווה' : 'Monthly worth'}: {Math.round(monthlyNet).toLocaleString()} ₪ {isHe ? 'רווח נטו' : 'net profit'}
      </div>
    </div>
  )
}

function SmartTips({ tips, lang }) {
  const isHe = lang === 'he'

  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 16, fontWeight: 700, color: theme.gold, marginBottom: 12 }}>
        💡 {isHe ? 'טיפים חכמים' : 'Smart Tips'}
      </h4>
      {tips.map((tip, index) => (
        <div key={index} style={{
          background: `${theme.gold}11`,
          border: `1px solid ${theme.brass}`,
          borderRadius: 6,
          padding: 12,
          marginBottom: 8,
          fontSize: 14
        }}>
          {tip}
        </div>
      ))}
    </div>
  )
}

function ComparisonBar({ currentMargin, newMargin, lang }) {
  const isHe = lang === 'he'
  const maxMargin = Math.max(currentMargin, newMargin)

  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 16, fontWeight: 700, color: theme.gold, marginBottom: 12 }}>
        {isHe ? 'השוואה לפרומו הקיים' : 'Comparison to Current Promo'}
      </h4>
      <div style={{ fontSize: 14, marginBottom: 8 }}>
        {isHe ? 'הפרומו הקיים: גולדסטאר (30₪) + שוט ערק (3₪ עלות) = שולי רווח 50%' : 'Current promo: Goldstar (30₪) + Arak shot (3₪ cost) = 50% margin'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: theme.warmGray, marginBottom: 4 }}>
            {isHe ? 'פרומו קיים' : 'Current Promo'}
          </div>
          <div style={{
            height: 20,
            background: theme.accent,
            borderRadius: 4,
            width: `${(currentMargin / maxMargin) * 100}%`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 8,
            color: theme.stone,
            fontSize: 12,
            fontWeight: 700
          }}>
            {currentMargin}%
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: theme.warmGray, marginBottom: 4 }}>
            {isHe ? 'פרומו חדש' : 'New Promo'}
          </div>
          <div style={{
            height: 20,
            background: newMargin > currentMargin ? VERDICT_COLORS.GREEN : VERDICT_COLORS.RED,
            borderRadius: 4,
            width: `${(newMargin / maxMargin) * 100}%`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 8,
            color: 'white',
            fontSize: 12,
            fontWeight: 700
          }}>
            {newMargin}%
          </div>
        </div>
      </div>
    </div>
  )
}

function SavedPromos({ savedPromos, onLoadPromo, lang }) {
  const isHe = lang === 'he'

  if (savedPromos.length === 0) return null

  return (
    <div style={{ marginTop: 40 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.stone, marginBottom: 16 }}>
        📁 {isHe ? 'פרומות שמורות' : 'Saved Promos'}
      </h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {savedPromos.map((promo, index) => (
          <div key={index} style={{
            background: theme.card,
            border: `1px solid ${theme.accent}`,
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 20 }}>{promo.typeIcon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.stone }}>
                  {promo.mainProduct}
                </div>
                <div style={{ fontSize: 12, color: theme.warmGray }}>
                  {promo.typeLabel}
                </div>
              </div>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: VERDICT_COLORS[promo.verdictColor]
              }} />
              <div style={{ fontSize: 14, color: theme.gold, fontWeight: 700 }}>
                {promo.margin}%
              </div>
            </div>
            <button
              onClick={() => onLoadPromo(promo)}
              style={{
                background: theme.gold,
                color: theme.bg,
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isHe ? 'טען מחדש' : 'Load'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PromoCalc({ lang }) {
  const isHe = lang === 'he'

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])

  // Promo configuration
  const [promoType, setPromoType] = useState('')
  const [buyProduct, setBuyProduct] = useState('')
  const [getProduct, setGetProduct] = useState('')
  const [discountProduct, setDiscountProduct] = useState('')
  const [discountType, setDiscountType] = useState('%')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [conditionalBuy, setConditionalBuy] = useState('')
  const [conditionalGet, setConditionalGet] = useState('')
  const [conditionalText, setConditionalText] = useState('')
  const [probability, setProbability] = useState(50)
  const [happyHourProduct, setHappyHourProduct] = useState('')
  const [happyHourPrice, setHappyHourPrice] = useState(0)
  const [happyHourHours, setHappyHourHours] = useState(3)
  const [happyHourCustomers, setHappyHourCustomers] = useState(8)

  // Common inputs
  const [dailyTransactions, setDailyTransactions] = useState(20)

  // Saved promos
  const [savedPromos, setSavedPromos] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('yosi_saved_promos')
    if (saved) {
      setSavedPromos(JSON.parse(saved))
    }
  }, [])

  // Calculations
  const calculations = useMemo(() => {
    if (!promoType) return null

    let salePrice = 0
    let buyCost = 0
    let giftCost = 0
    let discountValue = 0
    let adjustedMargin = 0
    let promoCostPerTx = 0
    let baseProfit = 0
    let investedPercent = 0

    const getProductById = (id) => PRODUCTS.find(p => p.id === id)

    switch (promoType) {
      case PROMO_TYPES.BUY_GET:
        const buyProd = getProductById(buyProduct)
        const getProd = getProductById(getProduct)
        if (!buyProd || !getProd) return null

        salePrice = buyProd.price
        buyCost = buyProd.cost
        giftCost = getProd.cost
        promoCostPerTx = giftCost
        baseProfit = salePrice - buyCost
        investedPercent = (promoCostPerTx / baseProfit) * 100
        adjustedMargin = ((salePrice - buyCost - promoCostPerTx) / salePrice) * 100
        break

      case PROMO_TYPES.DISCOUNT:
        const discProd = getProductById(discountProduct)
        if (!discProd) return null

        salePrice = discProd.price
        buyCost = discProd.cost
        discountValue = discountType === '%' ? (salePrice * discountAmount / 100) : discountAmount
        promoCostPerTx = discountValue
        baseProfit = salePrice - buyCost
        investedPercent = (promoCostPerTx / baseProfit) * 100
        adjustedMargin = ((salePrice - buyCost - promoCostPerTx) / salePrice) * 100
        break

      case PROMO_TYPES.CONDITIONAL:
        const condBuy = getProductById(conditionalBuy)
        const condGet = getProductById(conditionalGet)
        if (!condBuy || !condGet) return null

        salePrice = condBuy.price
        buyCost = condBuy.cost
        giftCost = condGet.cost
        promoCostPerTx = (giftCost * probability) / 100
        baseProfit = salePrice - buyCost
        investedPercent = (promoCostPerTx / baseProfit) * 100
        adjustedMargin = ((salePrice - buyCost - promoCostPerTx) / salePrice) * 100
        break

      case PROMO_TYPES.HAPPY_HOUR:
        const hhProd = getProductById(happyHourProduct)
        if (!hhProd) return null

        salePrice = happyHourPrice
        buyCost = hhProd.cost
        promoCostPerTx = hhProd.price - happyHourPrice // lost revenue per transaction
        baseProfit = hhProd.price - buyCost
        investedPercent = (promoCostPerTx / baseProfit) * 100
        adjustedMargin = ((salePrice - buyCost) / salePrice) * 100
        break
    }

    const dailyRevenue = dailyTransactions * salePrice
    const dailyPromoCost = dailyTransactions * promoCostPerTx
    const dailyNetProfit = dailyTransactions * (salePrice - buyCost - promoCostPerTx)
    const monthlyNetProfit = dailyNetProfit * 26 // assuming 26 working days

    return {
      salePrice,
      buyCost,
      giftCost,
      discountValue,
      promoCostPerTx,
      baseProfit,
      investedPercent,
      adjustedMargin,
      dailyRevenue,
      dailyPromoCost,
      dailyNetProfit,
      monthlyNetProfit,
      probability: promoType === PROMO_TYPES.CONDITIONAL ? probability : null
    }
  }, [promoType, buyProduct, getProduct, discountProduct, discountType, discountAmount, conditionalBuy, conditionalGet, probability, happyHourProduct, happyHourPrice, happyHourHours, happyHourCustomers, dailyTransactions])

  // Verdict logic
  const verdict = useMemo(() => {
    if (!calculations) return null

    const { adjustedMargin, investedPercent, dailyNetProfit } = calculations

    if (adjustedMargin >= 35 && investedPercent <= 30 && dailyNetProfit > 0) {
      return {
        color: 'GREEN',
        emoji: '✅',
        headline: isHe ? 'הפרומו הזה עובד' : 'This promo works',
        explanation: isHe
          ? `שולי הרווח ${Math.round(adjustedMargin)}% מעולים, וההשקעה בפרומו (${Math.round(investedPercent)}%) שווה את זה. הרווח היומי חיובי.`
          : `Margin of ${Math.round(adjustedMargin)}% is excellent, and the promo investment (${Math.round(investedPercent)}%) is worth it. Daily profit is positive.`
      }
    } else if ((adjustedMargin >= 20 && adjustedMargin < 35) || (investedPercent > 30 && investedPercent <= 50)) {
      return {
        color: 'YELLOW',
        emoji: '⚠️',
        headline: isHe ? 'כדאי לשקול' : 'Worth considering',
        explanation: isHe
          ? `שולי הרווח ${Math.round(adjustedMargin)}% סבירים, אבל ההשקעה בפרומו (${Math.round(investedPercent)}%) די גבוהה. בדוק אם הלקוחות מגיבים טוב.`
          : `Margin of ${Math.round(adjustedMargin)}% is reasonable, but promo investment (${Math.round(investedPercent)}%) is quite high. Check if customers respond well.`
      }
    } else {
      return {
        color: 'RED',
        emoji: '🚨',
        headline: isHe ? 'הפרומו הזה מסוכן' : 'This promo is risky',
        explanation: isHe
          ? `שולי הרווח ${Math.round(adjustedMargin)}% נמוכים מדי, וההשקעה בפרומו (${Math.round(investedPercent)}%) גבוהה. הרווח היומי שלילי - זה עלול להפסיד כסף.`
          : `Margin of ${Math.round(adjustedMargin)}% is too low, and promo investment (${Math.round(investedPercent)}%) is high. Daily profit is negative - this could lose money.`
      }
    }
  }, [calculations, isHe])

  // Smart tips
  const smartTips = useMemo(() => {
    if (!calculations) return []

    const tips = []
    const { giftCost, adjustedMargin, investedPercent, probability } = calculations

    const getProd = PRODUCTS.find(p => p.id === getProduct || p.id === conditionalGet)
    if (getProd && getProd.cost > 8) {
      const arak = PRODUCTS.find(p => p.id === 'arak')
      const savings = getProd.cost - arak.cost
      tips.push(isHe
        ? `💡 החלף את ${getProd.name_he} בערק (3₪) — תחסוך ${savings}₪ ביום`
        : `💡 Replace ${getProd.name_en} with Arak (3₪) — save ${savings}₪ per day`
      )
    }

    if (dailyTransactions > 30) {
      const reduction = Math.round(dailyTransactions * 0.3)
      const savings = Math.round(calculations.dailyPromoCost * 0.3)
      tips.push(isHe
        ? `💡 הגבל את הפרומו לשעות 18-21 — תחסוך ${savings}₪ ביום (פחות ${reduction} עסקאות)`
        : `💡 Limit promo to 18-21 hours — save ${savings}₪ per day (fewer ${reduction} transactions)`
      )
    }

    if (promoType === PROMO_TYPES.CONDITIONAL && probability > 60) {
      tips.push(isHe
        ? '⚠️ ההסתברות גבוהה — הפרומו יעלה לך כמעט כמו פרומו קבוע'
        : '⚠️ High probability — this promo will cost almost as much as a permanent one'
      )
    }

    if (promoType === PROMO_TYPES.CONDITIONAL && probability < 20) {
      tips.push(isHe
        ? '💡 הסתברות נמוכה — הפרומו כמעט לא עולה לך כלום, ויוצר המון התרגשות'
        : '💡 Low probability — this promo costs almost nothing and creates lots of excitement'
      )
    }

    if (adjustedMargin < calculations.baseProfit * 0.6) {
      const currentDiscount = calculations.baseProfit - (calculations.adjustedMargin / 100 * calculations.salePrice)
      const suggestedDiscount = currentDiscount * 0.7
      const savings = Math.round((currentDiscount - suggestedDiscount) * dailyTransactions)
      tips.push(isHe
        ? `💡 שקול הנחה קטנה יותר — ${Math.round(suggestedDiscount)}₪ במקום ${Math.round(currentDiscount)}₪ ישמור על שולי רווח בריאים (חיסכון ${savings}₪ ביום)`
        : `💡 Consider smaller discount — ${Math.round(suggestedDiscount)}₪ instead of ${Math.round(currentDiscount)}₪ maintains healthy margins (save ${savings}₪ per day)`
      )
    }

    if (promoType === PROMO_TYPES.HAPPY_HOUR) {
      tips.push(isHe
        ? '💡 הוסף תנאי: רק עם רכישת בירה — תמנע מינוס'
        : '💡 Add condition: only with beer purchase — prevents losses'
      )
    }

    return tips
  }, [calculations, promoType, getProduct, conditionalGet, dailyTransactions, isHe])

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSavePromo = () => {
    if (!calculations || !verdict) return

    const mainProduct = PRODUCTS.find(p => p.id === buyProduct || p.id === discountProduct || p.id === conditionalBuy || p.id === happyHourProduct)
    if (!mainProduct) return

    const typeLabels = {
      [PROMO_TYPES.BUY_GET]: isHe ? 'קנה קבל' : 'Buy Get',
      [PROMO_TYPES.DISCOUNT]: isHe ? 'הנחה' : 'Discount',
      [PROMO_TYPES.CONDITIONAL]: isHe ? 'מותנה' : 'Conditional',
      [PROMO_TYPES.HAPPY_HOUR]: isHe ? 'האפי אוור' : 'Happy Hour'
    }

    const typeIcons = {
      [PROMO_TYPES.BUY_GET]: '🎁',
      [PROMO_TYPES.DISCOUNT]: '🎯',
      [PROMO_TYPES.CONDITIONAL]: '🎲',
      [PROMO_TYPES.HAPPY_HOUR]: '⏰'
    }

    const newPromo = {
      type: promoType,
      typeIcon: typeIcons[promoType],
      typeLabel: typeLabels[promoType],
      mainProduct: isHe ? mainProduct.name_he : mainProduct.name_en,
      margin: Math.round(calculations.adjustedMargin),
      verdictColor: verdict.color,
      // Save all inputs for reloading
      inputs: {
        promoType,
        buyProduct,
        getProduct,
        discountProduct,
        discountType,
        discountAmount,
        conditionalBuy,
        conditionalGet,
        conditionalText,
        probability,
        happyHourProduct,
        happyHourPrice,
        happyHourHours,
        happyHourCustomers,
        dailyTransactions
      }
    }

    const updated = [...savedPromos, newPromo]
    setSavedPromos(updated)
    localStorage.setItem('yosi_saved_promos', JSON.stringify(updated))
  }

  const handleLoadPromo = (promo) => {
    const inputs = promo.inputs
    setPromoType(inputs.promoType)
    setBuyProduct(inputs.buyProduct || '')
    setGetProduct(inputs.getProduct || '')
    setDiscountProduct(inputs.discountProduct || '')
    setDiscountType(inputs.discountType || '%')
    setDiscountAmount(inputs.discountAmount || 0)
    setConditionalBuy(inputs.conditionalBuy || '')
    setConditionalGet(inputs.conditionalGet || '')
    setConditionalText(inputs.conditionalText || '')
    setProbability(inputs.probability || 50)
    setHappyHourProduct(inputs.happyHourProduct || '')
    setHappyHourPrice(inputs.happyHourPrice || 0)
    setHappyHourHours(inputs.happyHourHours || 3)
    setHappyHourCustomers(inputs.happyHourCustomers || 8)
    setDailyTransactions(inputs.dailyTransactions || 20)
    setCurrentStep(1)
    setCompletedSteps([])
  }

  const handleCreateSummary = () => {
    if (!calculations || !verdict) return

    const summary = `
פרומו: ${verdict.emoji} ${verdict.headline}

פירוט כלכלי:
- מחיר מכירה: ${calculations.salePrice}₪
- עלות מוצר: ${calculations.buyCost}₪
- עלות פרומו: ${Math.round(calculations.promoCostPerTx)}₪
- רווח לעסקה: ${Math.round(calculations.salePrice - calculations.buyCost - calculations.promoCostPerTx)}₪
- שולי רווח: ${Math.round(calculations.adjustedMargin)}%

תחזית יומית:
- הכנסה: ${Math.round(calculations.dailyRevenue)}₪
- עלות פרומו: ${Math.round(calculations.dailyPromoCost)}₪
- רווח נטו: ${Math.round(calculations.dailyNetProfit)}₪

תחזית חודשית: ${Math.round(calculations.monthlyNetProfit)}₪ רווח נטו

${verdict.explanation}
    `.trim()

    navigator.clipboard.writeText(summary)
    alert(isHe ? 'סיכום הועתק ללוח' : 'Summary copied to clipboard')
  }

  const renderStep1 = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.stone, marginBottom: 4 }}>
        🎯 {isHe ? 'בחר סוג פרומו' : 'Choose Promo Type'}
      </h2>
      <p style={{ fontSize: 13, color: theme.warmGray, marginBottom: 24 }}>
        {isHe ? 'מה סוג הפרומו שברצונך לנתח?' : 'What type of promo do you want to analyze?'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => setPromoType(PROMO_TYPES.BUY_GET)}
          style={{
            background: promoType === PROMO_TYPES.BUY_GET ? theme.gold : theme.card,
            border: `2px solid ${promoType === PROMO_TYPES.BUY_GET ? theme.gold : theme.accent}`,
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎁</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.stone, marginBottom: 4 }}>
            {isHe ? 'קנה X קבל Y' : 'Buy X Get Y'}
          </div>
          <div style={{ fontSize: 12, color: theme.warmGray }}>
            {isHe ? 'פרומו קלאסי' : 'Classic promo'}
          </div>
        </button>

        <button
          onClick={() => setPromoType(PROMO_TYPES.DISCOUNT)}
          style={{
            background: promoType === PROMO_TYPES.DISCOUNT ? theme.gold : theme.card,
            border: `2px solid ${promoType === PROMO_TYPES.DISCOUNT ? theme.gold : theme.accent}`,
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.stone, marginBottom: 4 }}>
            {isHe ? 'הנחה על X' : 'Discount on X'}
          </div>
          <div style={{ fontSize: 12, color: theme.warmGray }}>
            {isHe ? 'הנחה ישירה' : 'Direct discount'}
          </div>
        </button>

        <button
          onClick={() => setPromoType(PROMO_TYPES.CONDITIONAL)}
          style={{
            background: promoType === PROMO_TYPES.CONDITIONAL ? theme.gold : theme.card,
            border: `2px solid ${promoType === PROMO_TYPES.CONDITIONAL ? theme.gold : theme.accent}`,
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎲</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.stone, marginBottom: 4 }}>
            {isHe ? 'קנה X וגנה Y' : 'Conditional Promo'}
          </div>
          <div style={{ fontSize: 12, color: theme.warmGray }}>
            {isHe ? 'win/event' : 'Win/Event'}
          </div>
        </button>

        <button
          onClick={() => setPromoType(PROMO_TYPES.HAPPY_HOUR)}
          style={{
            background: promoType === PROMO_TYPES.HAPPY_HOUR ? theme.gold : theme.card,
            border: `2px solid ${promoType === PROMO_TYPES.HAPPY_HOUR ? theme.gold : theme.accent}`,
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏰</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.stone, marginBottom: 4 }}>
            {isHe ? 'מחיר מיוחד בשעה X' : 'Happy Hour Price'}
          </div>
          <div style={{ fontSize: 12, color: theme.warmGray }}>
            {isHe ? 'האפי אוור' : 'Happy hour'}
          </div>
        </button>
      </div>

      {promoType && (
        <div style={{
          background: theme.card,
          border: `1px solid ${theme.accent}`,
          borderRadius: 8,
          padding: 20,
          marginBottom: 24
        }}>
          {promoType === PROMO_TYPES.BUY_GET && (
            <>
              <ProductSelector
                label={isHe ? 'הלקוח קונה:' : 'Customer buys:'}
                value={buyProduct}
                onChange={setBuyProduct}
                lang={lang}
              />
              <ProductSelector
                label={isHe ? 'ומקבל חינם:' : 'And gets free:'}
                value={getProduct}
                onChange={setGetProduct}
                lang={lang}
              />
              <NumberInput
                label={isHe ? 'כמות עסקאות יומיות משוערות:' : 'Estimated daily transactions:'}
                value={dailyTransactions}
                onChange={setDailyTransactions}
                min={1}
              />
            </>
          )}

          {promoType === PROMO_TYPES.DISCOUNT && (
            <>
              <ProductSelector
                label={isHe ? 'מוצר להנחה:' : 'Product for discount:'}
                value={discountProduct}
                onChange={setDiscountProduct}
                lang={lang}
              />
              <Toggle
                label={isHe ? 'סוג הנחה:' : 'Discount type:'}
                value={discountType}
                onChange={setDiscountType}
                options={[
                  { value: '%', label: '%' },
                  { value: '₪', label: '₪' }
                ]}
              />
              <NumberInput
                label={isHe ? 'גובה ההנחה:' : 'Discount amount:'}
                value={discountAmount}
                onChange={setDiscountAmount}
                suffix={discountType}
                min={0}
                step={discountType === '%' ? 1 : 1}
              />
              <NumberInput
                label={isHe ? 'עסקאות יומיות משוערות:' : 'Estimated daily transactions:'}
                value={dailyTransactions}
                onChange={setDailyTransactions}
                min={1}
              />
            </>
          )}

          {promoType === PROMO_TYPES.CONDITIONAL && (
            <>
              <ProductSelector
                label={isHe ? 'הלקוח קונה:' : 'Customer buys:'}
                value={conditionalBuy}
                onChange={setConditionalBuy}
                lang={lang}
              />
              <ProductSelector
                label={isHe ? 'ומקבל חינם אם:' : 'And gets free if:'}
                value={conditionalGet}
                onChange={setConditionalGet}
                lang={lang}
              />
              <label style={{ display: 'block', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: theme.warmGray, marginBottom: 4, fontWeight: 700 }}>
                  {isHe ? 'התנאי:' : 'Condition:'}
                </div>
                <input
                  type="text"
                  value={conditionalText}
                  onChange={e => setConditionalText(e.target.value)}
                  placeholder={isHe ? 'למשל: הקבוצה שלך מנצחת' : 'e.g. Your team wins'}
                  style={{
                    width: '100%',
                    background: theme.cardDeep,
                    border: `1px solid ${theme.accent}`,
                    color: theme.stone,
                    borderRadius: 6,
                    padding: '12px',
                    fontSize: 14,
                    fontFamily: "'Frank Ruhl Libre', serif",
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
              </label>
              <Slider
                label={isHe ? 'הסתברות שהתנאי יתקיים:' : 'Probability condition occurs:'}
                value={probability}
                onChange={setProbability}
              />
              <NumberInput
                label={isHe ? 'עסקאות יומיות משוערות:' : 'Estimated daily transactions:'}
                value={dailyTransactions}
                onChange={setDailyTransactions}
                min={1}
              />
            </>
          )}

          {promoType === PROMO_TYPES.HAPPY_HOUR && (
            <>
              <ProductSelector
                label={isHe ? 'מוצר בהאפי אוור:' : 'Happy hour product:'}
                value={happyHourProduct}
                onChange={setHappyHourProduct}
                lang={lang}
              />
              <NumberInput
                label={isHe ? 'מחיר בשעת האפי אוור:' : 'Happy hour price:'}
                value={happyHourPrice}
                onChange={setHappyHourPrice}
                suffix="₪"
                min={0}
              />
              <NumberInput
                label={isHe ? 'כמה שעות ביום:' : 'Hours per day:'}
                value={happyHourHours}
                onChange={setHappyHourHours}
                min={1}
                max={24}
              />
              <NumberInput
                label={isHe ? 'לקוחות בשעה בממוצע:' : 'Avg customers per hour:'}
                value={happyHourCustomers}
                onChange={setHappyHourCustomers}
                min={1}
              />
            </>
          )}
        </div>
      )}

      <button
        onClick={handleNextStep}
        disabled={!promoType}
        style={{
          background: promoType ? theme.gold : theme.warmGray,
          color: theme.bg,
          border: 'none',
          borderRadius: 8,
          padding: '16px 32px',
          fontSize: 16,
          fontWeight: 700,
          cursor: promoType ? 'pointer' : 'not-allowed',
          width: '100%'
        }}
      >
        {isHe ? 'המשך לניתוח ←' : 'Continue to Analysis ←'}
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.stone, marginBottom: 4 }}>
        📊 {isHe ? 'ניתוח כלכלי חי' : 'Live Financial Analysis'}
      </h2>
      <p style={{ fontSize: 13, color: theme.warmGray, marginBottom: 24 }}>
        {isHe ? 'המספרים מתעדכנים בזמן אמת לפי הקלט שלך.' : 'Numbers update in real-time based on your inputs.'}
      </p>

      {calculations && (
        <>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.gold, marginBottom: 12 }}>
              {isHe ? 'A. פירוט לעסקה' : 'A. Per Transaction Breakdown'}
            </h3>
            <ReceiptBreakdown items={[
              { label: isHe ? 'מחיר מכירה' : 'Sale Price', value: `${calculations.salePrice} ₪` },
              { label: isHe ? 'עלות מוצר שנקנה' : 'Cost of Purchased Item', value: `-${calculations.buyCost} ₪` },
              { label: promoType === PROMO_TYPES.DISCOUNT
                ? (isHe ? 'עלות ההנחה' : 'Discount Cost')
                : (isHe ? 'עלות המתנה' : 'Gift Cost'),
                value: `-${Math.round(calculations.promoCostPerTx)} ₪` },
              { separator: true },
              { label: isHe ? 'רווח לעסקה' : 'Profit per Transaction', value: `${Math.round(calculations.salePrice - calculations.buyCost - calculations.promoCostPerTx)} ₪`, bold: true },
              { label: isHe ? 'שולי רווח' : 'Margin', value: `${Math.round(calculations.adjustedMargin)}%`, bold: true, color: theme.gold }
            ]} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.gold, marginBottom: 12 }}>
              {isHe ? 'B. השוואה ללא פרומו' : 'B. Without Promo Comparison'}
            </h3>
            <ReceiptBreakdown items={[
              { label: isHe ? 'רווח ללא פרומו' : 'Profit without Promo', value: `${Math.round(calculations.baseProfit)} ₪ (${Math.round((calculations.baseProfit / calculations.salePrice) * 100)}%)` },
              { label: isHe ? 'עלות הפרומו לעסקה' : 'Promo Cost per Transaction', value: `${Math.round(calculations.promoCostPerTx)} ₪` },
              { label: isHe ? 'אחוז הרווח המושקע בפרומו' : '% of Profit Invested in Promo', value: `${Math.round(calculations.investedPercent)}%`, color: calculations.investedPercent > 50 ? VERDICT_COLORS.RED : theme.stone }
            ]} />
          </div>

          {promoType === PROMO_TYPES.CONDITIONAL && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.gold, marginBottom: 12 }}>
                {isHe ? 'C. מתמטיקה של הסתברות' : 'C. Probability Math'}
              </h3>
              <ReceiptBreakdown items={[
                { label: isHe ? 'הסתברות לתת מתנה' : 'Probability of Giving Gift', value: `${calculations.probability}%` },
                { label: isHe ? 'עלות מתנה ממוצעת' : 'Average Gift Cost', value: `${Math.round(calculations.promoCostPerTx)} ₪ לעסקה` },
                { label: isHe ? 'שולי רווח מותאמים' : 'Adjusted Margin', value: `${Math.round(calculations.adjustedMargin)}%`, bold: true, color: theme.gold }
              ]} />
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.gold, marginBottom: 12 }}>
              {isHe ? 'D. אומדן יומי' : 'D. Daily Estimate'}
            </h3>
            <ReceiptBreakdown items={[
              { label: isHe ? 'עסקאות משוערות' : 'Estimated Transactions', value: dailyTransactions.toString() },
              { label: isHe ? 'הכנסה יומית' : 'Daily Revenue', value: `${Math.round(calculations.dailyRevenue)} ₪` },
              { label: isHe ? 'עלות פרומו יומית' : 'Daily Promo Cost', value: `${Math.round(calculations.dailyPromoCost)} ₪` },
              { separator: true },
              { label: isHe ? 'רווח יומי נטו' : 'Daily Net Profit', value: `${Math.round(calculations.dailyNetProfit)} ₪`, bold: true, color: calculations.dailyNetProfit > 0 ? VERDICT_COLORS.GREEN : VERDICT_COLORS.RED }
            ]} />
            {promoType === PROMO_TYPES.HAPPY_HOUR && (
              <div style={{ marginTop: 12, fontSize: 14, color: theme.warmGray }}>
                {isHe ? 'אומדן חודשי (26 ימי עבודה):' : 'Monthly estimate (26 working days):'} {Math.round(calculations.monthlyNetProfit)} ₪
              </div>
            )}
          </div>
        </>
      )}

      <button
        onClick={handleNextStep}
        style={{
          background: theme.gold,
          color: theme.bg,
          border: 'none',
          borderRadius: 8,
          padding: '16px 32px',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          width: '100%'
        }}
      >
        {isHe ? 'ראה את הפסיקה ←' : 'See Verdict ←'}
      </button>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.stone, marginBottom: 4 }}>
        ⚖️ {isHe ? 'הפסיקה' : 'The Verdict'}
      </h2>
      <p style={{ fontSize: 13, color: theme.warmGray, marginBottom: 24 }}>
        {isHe ? 'המחשבון החליט — האם הפרומו הזה חכם כלכלית?' : 'The calculator has decided — is this promo financially smart?'}
      </p>

      {verdict && calculations && (
        <>
          <VerdictCard
            verdict={verdict}
            explanation={verdict.explanation}
            monthlyNet={calculations.monthlyNetProfit}
            lang={lang}
          />

          {smartTips.length > 0 && (
            <SmartTips tips={smartTips} lang={lang} />
          )}

          <ComparisonBar
            currentMargin={50} // Current promo margin
            newMargin={Math.round(calculations.adjustedMargin)}
            lang={lang}
          />

          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button
              onClick={handlePrevStep}
              style={{
                flex: 1,
                background: theme.card,
                border: `1px solid ${theme.accent}`,
                color: theme.stone,
                borderRadius: 8,
                padding: '16px',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ← {isHe ? 'ערוך את הפרומו' : 'Edit Promo'}
            </button>
            <button
              onClick={handleSavePromo}
              style={{
                flex: 1,
                background: theme.gold,
                color: theme.bg,
                border: 'none',
                borderRadius: 8,
                padding: '16px',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              💾 {isHe ? 'שמור פרומו' : 'Save Promo'}
            </button>
          </div>

          <button
            onClick={handleCreateSummary}
            style={{
              background: theme.card,
              border: `1px solid ${theme.accent}`,
              color: theme.stone,
              borderRadius: 8,
              padding: '16px 32px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%'
            }}
          >
            📋 {isHe ? 'צור סיכום' : 'Create Summary'}
          </button>
        </>
      )}
    </div>
  )

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <SavedPromos
        savedPromos={savedPromos}
        onLoadPromo={handleLoadPromo}
        lang={lang}
      />
    </div>
  )
}
