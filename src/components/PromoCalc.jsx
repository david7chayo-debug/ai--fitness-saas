import { useState } from 'react'
import { theme } from '../theme'

function NumberInput({ label, value, onChange, prefix, suffix }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
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
            padding: '9px 12px',
            fontSize: 15,
            fontFamily: "'Frank Ruhl Libre', serif",
            fontWeight: 700,
            outline: 'none',
          }}
          min={0}
        />
        {suffix && <span style={{ fontSize: 13, color: theme.warmGray }}>{suffix}</span>}
      </div>
    </label>
  )
}

function ResultCard({ items }) {
  return (
    <div style={{
      background: `${theme.gold}11`,
      border: `1px solid ${theme.brass}`,
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
    }}>
      {items.map(({ label, value, big }) => (
        <div key={label} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 0',
          borderBottom: `1px solid ${theme.accent}30`,
        }}>
          <span style={{ fontSize: big ? 14 : 12, color: theme.parchment, fontWeight: big ? 700 : 400 }}>{label}</span>
          <span style={{ fontSize: big ? 20 : 14, fontWeight: 700, color: big ? theme.gold : theme.stone }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

export function PromoCalc({ lang }) {
  const isHe = lang === 'he'

  // Shot promo
  const [beerCost,  setBeerCost]  = useState(10)
  const [beerPrice, setBeerPrice] = useState(30)
  const [shotCost,  setShotCost]  = useState(5)
  const [beersNight, setBeersNight] = useState(80)
  const [nightsMonth, setNightsMonth] = useState(20)

  // Happy hour
  const [hhNights, setHhNights]   = useState(5)
  const [hhIncrease, setHhIncrease] = useState(30)
  const [hhAvgSpend, setHhAvgSpend] = useState(45)
  const [baseCustomers, setBaseCustomers] = useState(40)

  // Shot calc
  const marginPerBeer = beerPrice - beerCost - shotCost
  const nightlyProfit = marginPerBeer * beersNight
  const monthlyProfit = nightlyProfit * nightsMonth

  // Happy hour calc
  const extraCustomers = Math.round(baseCustomers * hhIncrease / 100)
  const extraRevenueNight = extraCustomers * hhAvgSpend
  const extraRevenueMonth = extraRevenueNight * hhNights * 4

  const sectionStyle = {
    background: theme.card,
    border: `1px solid ${theme.accent}`,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  }

  const fmtNIS = n => `${Math.round(n).toLocaleString()} ₪`

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.stone, marginBottom: 4 }}>
        💰 {isHe ? 'מחשבון רווחים' : 'Profit Calculator'}
      </h2>
      <p style={{ fontSize: 13, color: theme.warmGray, marginBottom: 24 }}>
        {isHe ? 'חשב את הרווחיות של המבצעים שלך בזמן אמת.' : 'Calculate your promo profitability in real time.'}
      </p>

      {/* Shot Promo */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: theme.gold, marginBottom: 16 }}>
          🥃 {isHe ? 'מבצע בירה + שוט' : 'Beer + Shot Promo'}
        </h3>
        <NumberInput label={isHe ? 'עלות בירה ₪' : 'Beer cost ₪'} value={beerCost} onChange={setBeerCost} />
        <NumberInput label={isHe ? 'מחיר מכירה בירה ₪' : 'Beer sale price ₪'} value={beerPrice} onChange={setBeerPrice} />
        <NumberInput label={isHe ? 'עלות שוט ₪' : 'Shot cost ₪'} value={shotCost} onChange={setShotCost} />
        <NumberInput label={isHe ? 'בירות בלילה' : 'Beers per night'} value={beersNight} onChange={setBeersNight} />
        <NumberInput label={isHe ? 'לילות בחודש' : 'Nights per month'} value={nightsMonth} onChange={setNightsMonth} />
        <ResultCard items={[
          { label: isHe ? 'מרווח לבירה' : 'Margin per beer', value: fmtNIS(marginPerBeer) },
          { label: isHe ? 'רווח לילי' : 'Nightly profit', value: fmtNIS(nightlyProfit) },
          { label: isHe ? 'רווח חודשי (אומדן)' : 'Monthly estimate', value: fmtNIS(monthlyProfit), big: true },
        ]} />
      </div>

      {/* Happy Hour */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: theme.gold, marginBottom: 16 }}>
          ☀️ {isHe ? 'האפי אוור 18:00–21:00' : 'Happy Hour 18:00–21:00'}
        </h3>
        <NumberInput label={isHe ? 'לקוחות בסיס בלילה' : 'Base customers/night'} value={baseCustomers} onChange={setBaseCustomers} />
        <NumberInput label={isHe ? 'לילות האפי אוור בשבוע' : 'Happy hour nights/week'} value={hhNights} onChange={setHhNights} />
        <NumberInput label={isHe ? 'עלייה צפויה בלקוחות %' : 'Expected customer increase %'} value={hhIncrease} onChange={setHhIncrease} suffix="%" />
        <NumberInput label={isHe ? 'הוצאה ממוצעת לאורח ₪' : 'Avg spend per guest ₪'} value={hhAvgSpend} onChange={setHhAvgSpend} />
        <ResultCard items={[
          { label: isHe ? 'לקוחות נוספים בלילה' : 'Extra customers/night', value: `+${extraCustomers}` },
          { label: isHe ? 'הכנסה נוספת בלילה' : 'Extra revenue/night', value: fmtNIS(extraRevenueNight) },
          { label: isHe ? 'הכנסה נוספת חודשית' : 'Monthly extra revenue', value: fmtNIS(extraRevenueMonth), big: true },
        ]} />
      </div>
    </div>
  )
}
