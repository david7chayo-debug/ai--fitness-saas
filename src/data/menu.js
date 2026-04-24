export const DEFAULT_MENU = {
  beer: {
    icon: '🍺', label_he: 'בירות', label_en: 'Beer',
    subcats: [
      {
        title_he: 'בקבוק', title_en: 'Bottle',
        items: [
          { id:'b1', he:'גולדסטאר', en:'Goldstar', price:'28/32 ₪', emoji:'🍺', vibe_he:'המלך של הבר. תמיד היה, תמיד יהיה.', vibe_en:'The king of the bar. Always was, always will be.', note_he:'לאגר ישראלי · 4.9%', note_en:'Israeli lager · 4.9%', active:true, popular:true },
          { id:'b2', he:'מכבי', en:'Maccabi', price:'28/32 ₪', emoji:'🍺', vibe_he:'נקייה, קלילה, מרעננת. הקלאסיקה הישראלית.', vibe_en:'Clean, light, refreshing. The Israeli classic.', note_he:'לאגר פרמיום · 4.9%', note_en:'Premium lager · 4.9%', active:true },
          { id:'b3', he:'קרלסברג', en:'Carlsberg', price:'28/32 ₪', emoji:'🍺', vibe_he:'אחת הבירות הנמכרות בעולם. לא סתם.', vibe_en:"One of the world's best-selling beers. Not for nothing.", note_he:'לאגר דני · 5.0%', note_en:'Danish lager · 5.0%', active:true },
          { id:'b4', he:'היינקן', en:'Heineken', price:'28 ₪', emoji:'🍺', vibe_he:'בירת המכס. מגיע ממנה.', vibe_en:'The airport beer. It earns its status.', note_he:'לאגר הולנדי · 5.0%', note_en:'Dutch lager · 5.0%', active:true },
          { id:'b5', he:'גולדסטאר לא מסוננת', en:'Goldstar Unfiltered', price:'28 ₪', emoji:'🌾', vibe_he:'גולדסטאר עם אופי. עכורה, עשירה, אחרת.', vibe_en:'Goldstar with character. Cloudy, rich, different.', note_he:'בלתי מסוננת · 4.9%', note_en:'Unfiltered · 4.9%', active:true },
          { id:'b6', he:'קאטאנה', en:'Katana', price:'28 ₪', emoji:'⚔️', vibe_he:'חדה כמו השם שלה. ישראלית, ישירה.', vibe_en:'Sharp as the name. Israeli, straight to the point.', note_he:'לאגר ישראלי · 5.0%', note_en:'Israeli lager · 5.0%', active:true },
          { id:'b7', he:'0% ללא אלכוהול', en:'0% Alcohol Free', price:'25 ₪', emoji:'💧', vibe_he:'כי לפעמים שותים בשביל הטעם.', vibe_en:'Because sometimes you drink for the taste.', note_he:'ללא אלכוהול', note_en:'No alcohol', active:true },
        ]
      },
      {
        title_he: 'קסטל — בירות פירות בלגיות', title_en: 'Kasteel — Belgian Fruit Ales',
        items: [
          { id:'k1', he:"קסטל רוז'", en:'Kasteel Rouge', price:'32 ₪', emoji:'🍒', vibe_he:"שרי מתוק-חמצמץ בבירה בלגית. אל תשפוט לפי הצבע — מכה חזק.", vibe_en:"Tart cherries in a Belgian ale. Don't judge by the color — it hits hard.", note_he:'בירת שרי · 8% · אדום רובי', note_en:'Cherry ale · 8% · Ruby red', active:true },
          { id:'k2', he:'קסטל רובוס', en:'Kasteel Rubus', price:'32 ₪', emoji:'🫐', vibe_he:'פטל אמיתי בפנים. בירת קיץ נצחית — מתוקה, פירותית, מסוכנת.', vibe_en:'Real raspberries inside. The eternal summer beer — sweet, fruity, dangerous.', note_he:'בירת פטל · 7% · אדום-סגול', note_en:'Raspberry ale · 7% · Purple-red', active:true },
          { id:'k3', he:'קסטל טרופיקל', en:'Kasteel Tropical', price:'32 ₪', emoji:'🥭', vibe_he:'מנגו, פסיפלורה ואננס בבקבוק. טעם של חופשה.', vibe_en:'Mango, passion fruit & pineapple in a bottle. Tastes like a holiday.', note_he:'פירות טרופיים · 7% · צהוב-זהוב', note_en:'Tropical fruits · 7% · Golden yellow', active:true },
        ]
      },
      {
        title_he: 'חבית', title_en: 'Draft',
        items: [
          { id:'d1', he:'שפירא IPA', en:'Shapira IPA', price:'28/32 ₪', emoji:'🍻', vibe_he:'IPA ירושלמית מהמרתף של האחים שפירא. הדרי, אשכולית, מרירות מהנה.', vibe_en:"Jerusalem IPA from the Shapira brothers' basement. Citrus, grapefruit, satisfying bitterness.", note_he:'IPA · 6.5% · מבשלת שפירא, ירושלים', note_en:'IPA · 6.5% · Shapira Brewery, Jerusalem', active:true, popular:true },
          { id:'d2', he:'היינקן חבית', en:'Heineken Draft', price:'28/32 ₪', emoji:'🍺', vibe_he:'מהחבית זה אחרת. קרירה, מוקצפת, כמו שצריך.', vibe_en:"From the tap it's different. Cold, foamy, exactly right.", note_he:'לאגר · 5.0% · חצי / שלם', note_en:'Lager · 5.0% · Half / Full', active:true },
          { id:'d3', he:'וויסנשטפן חיטה', en:'Weihenstephan Hefeweizen', price:'32/36 ₪', emoji:'🌾', vibe_he:'בירת החיטה הטובה בעולם. מוסד בווארי מ-1040. בננה וציפורן.', vibe_en:"The world's best wheat beer. Bavarian institution since 1040. Banana and clove.", note_he:'חיטה · 5.4% · המבשלה העתיקה בעולם', note_en:"Hefeweizen · 5.4% · World's oldest brewery", active:true },
          { id:'d4', he:'גולדסטאר לא מסוננת חבית', en:'Goldstar Unfiltered Draft', price:'28/32 ₪', emoji:'🌾', vibe_he:'גולדסטאר כמו שהיא צריכה להיות. ישר מהחבית, ישר ללב.', vibe_en:'Goldstar as it should be. Straight from the tap, straight to the heart.', note_he:'בלתי מסוננת · 4.9%', note_en:'Unfiltered · 4.9%', active:true },
        ]
      }
    ]
  },
  spirits: {
    icon: '🥃', label_he: 'שוטים', label_en: 'Shots',
    subcats: [
      {
        title_he: 'שוטים', title_en: 'Shots',
        items: [
          { id:'s1', he:'ערק', en:'Arak', price:'15/30 ₪', emoji:'🥛', vibe_he:'אניס מהמזרח התיכון. ישראלי עד העצם.', vibe_en:'Anise from the Middle East. Israeli to the bone.', note_he:'יחיד / כפול', note_en:'Single / Double', active:true },
          { id:'s2', he:"ג'ין", en:'Gin', price:'15/30 ₪', emoji:'🌿', vibe_he:"עשבוני, ניחוח ג'וניפר. מי שמבין — מזמין.", vibe_en:'Herbal, juniper aroma. The ones who know — order it.', note_he:'יחיד / כפול', note_en:'Single / Double', active:true },
          { id:'s3', he:'רום', en:'Rum', price:'15/30 ₪', emoji:'🍬', vibe_he:'מתוק, חם, ישר לנקודה.', vibe_en:'Sweet, warm, straight to the point.', note_he:'יחיד / כפול', note_en:'Single / Double', active:true },
          { id:'s4', he:'טובי', en:'Toby', price:'15/30 ₪', emoji:'🥃', vibe_he:'הישראלי של הבר. קל, ידידותי, נכנס בקלות.', vibe_en:'The Israeli bar staple. Easy, friendly, goes down smooth.', note_he:'יחיד / כפול', note_en:'Single / Double', active:true },
          { id:'s5', he:'בקארדי לבן', en:'Bacardi Blanco', price:'15/30 ₪', emoji:'🥃', vibe_he:'רום לבן קלאסי. הבסיס של כל קוקטייל טוב.', vibe_en:'Classic white rum. The base of every good cocktail.', note_he:'יחיד / כפול', note_en:'Single / Double', active:true },
          { id:'s6', he:'טקילה', en:'Tequila', price:'15/30 ₪', emoji:'🌵', vibe_he:'אחרי הראשון תרצה עוד אחד. אזהרנו.', vibe_en:"After the first you'll want another. Don't say we didn't warn you.", note_he:'יחיד / כפול', note_en:'Single / Double', active:true },
          { id:'s7', he:'פרנט', en:'Fernet', price:'30/60 ₪', emoji:'🌑', vibe_he:'מר, עשבוני, מיוחד. לא לכולם — אבל לך כן.', vibe_en:'Bitter, herbal, unique. Not for everyone — but for you, yes.', note_he:'יחיד / כפול', note_en:'Single / Double', active:true },
          { id:'s8', he:'וואן נור', en:'Wan Nour', price:'15/30 ₪', emoji:'🌙', vibe_he:'עראק לבנוני מסורתי. חזק ואמיתי.', vibe_en:'Traditional Lebanese arak. Strong and real.', note_he:'יחיד / כפול', note_en:'Single / Double', active:true },
        ]
      },
      {
        title_he: 'וויסקי', title_en: 'Whisky',
        items: [
          { id:'w1', he:"ג'ק דניאלס", en:"Jack Daniel's", price:'20/40 ₪', emoji:'🥃', vibe_he:'טנסי קלאסי. וניל, קרמל, עשן קל. הוויסקי של כולם.', vibe_en:"Tennessee classic. Vanilla, caramel, light smoke. Everyone's whisky.", active:true },
          { id:'w2', he:'בושמילס', en:'Bushmills', price:'15/30 ₪', emoji:'☘️', vibe_he:'אירי, חלק, נעים לשתייה. אין מה להתווכח.', vibe_en:'Irish, smooth, easy drinking. No argument here.', active:true },
          { id:'w3', he:'גלנפידיך', en:'Glenfiddich', price:'30/60 ₪', emoji:'🏔️', vibe_he:'סינגל מאלט סקוטי. אגסים, מלון, וניל. לאנשים עם טעם.', vibe_en:'Scottish single malt. Pear, melon, vanilla. For people with taste.', active:true },
        ]
      },
      {
        title_he: 'וודקה ולִיקֵר', title_en: 'Vodka & Liqueur',
        items: [
          { id:'v1', he:'פילזנר וודקה', en:'Pilzner Vodka', price:'15/30 ₪', emoji:'💎', vibe_he:'נקייה, נייטרלית, מרגישה טוב. עובדת עם הכל.', vibe_en:'Clean, neutral, feels good. Works with everything.', active:true },
          { id:'v2', he:'קמפרי', en:'Campari', price:'15/30 ₪', emoji:'🔴', vibe_he:'אדום, מר, איטלקי. הבסיס של הנגרוני.', vibe_en:'Red, bitter, Italian. The soul of a Negroni.', active:true },
        ]
      }
    ]
  },
  cocktails: {
    icon: '🍹', label_he: 'קוקטיילים', label_en: 'Cocktails',
    subcats: [
      {
        title_he: 'קוקטיילים', title_en: 'Cocktails',
        items: [
          { id:'c1', he:'אפרול ספריץ', en:'Aperol Spritz', price:'45 ₪', emoji:'🍊', vibe_he:'כתום, קליל, מרענן. הקוקטייל של השקיעה.', vibe_en:'Orange, light, refreshing. The sunset cocktail.', active:true, popular:true },
          { id:'c2', he:'וויסקי סאוור', en:'Whisky Sour', price:'45 ₪', emoji:'🍋', vibe_he:'חמצמץ, מתוק, עם בעיטה. קלאסיקה שלא מתיישנת.', vibe_en:'Sour, sweet, with a kick. A classic that never ages.', active:true },
          { id:'c3', he:'נגרוני', en:'Negroni', price:'45 ₪', emoji:'🍷', vibe_he:"ג'ין, קמפרי, ורמוט. מר, עמוק, מתוחכם.", vibe_en:'Gin, Campari, vermouth. Bitter, deep, sophisticated.', active:true },
          { id:'c4', he:"ג'ין טוניק", en:'Gin & Tonic', price:'45 ₪', emoji:'🫧', vibe_he:"הג'ין עושה את העבודה, הטוניק מסיים אותה.", vibe_en:'The gin does the work, the tonic finishes it.', active:true },
          { id:'c5', he:'מוחיטו', en:'Mojito', price:'45 ₪', emoji:'🌿', vibe_he:'נענע, ליים, רום. קיצי, קליל, מחייך.', vibe_en:'Mint, lime, rum. Summery, light, makes you smile.', active:true },
        ]
      },
      {
        title_he: 'מעורבבים', title_en: 'Mixers',
        items: [
          { id:'m1', he:'וודקה פילזנר', en:'Vodka Pilzner', price:'45 ₪', emoji:'💥', vibe_he:'וודקה עם בירה. פשוט, יעיל, עובד.', vibe_en:'Vodka with beer. Simple, effective, works.', active:true },
          { id:'m2', he:'וויסקי קולה', en:'Whisky Cola', price:'45 ₪', emoji:'🥤', vibe_he:'הקלאסיק הנצחי. לא צריך הסבר.', vibe_en:'The eternal classic. No explanation needed.', active:true },
          { id:'m3', he:'שרק לימונית', en:'Sharak Limonit', price:'35 ₪', emoji:'🍋', vibe_he:'ערק + לימונדה ביתית. הרגשה ישראלית מאה אחוז.', vibe_en:'Arak + house lemonade. One hundred percent Israeli.', note_he:'ערק + לימונדה', note_en:'Arak + Lemonade', active:true, popular:true },
        ]
      }
    ]
  },
  diy: {
    icon: '✨', label_he: 'בנה שלך', label_en: 'Build Yours',
  },
  soft: {
    icon: '🥤', label_he: 'שתייה רכה', label_en: 'Soft Drinks',
    subcats: [
      {
        title_he: 'קרים', title_en: 'Cold',
        items: [
          { id:'so1', he:'קולה / זירו', en:'Cola / Zero', price:'10/12 ₪', emoji:'🥤', vibe_he:'כי לפעמים פשוט צריך קולה.', vibe_en:'Because sometimes you just need a Coke.', active:true },
          { id:'so2', he:'סודה', en:'Soda', price:'10 ₪', emoji:'🫧', vibe_he:'לבסיס של הקוקטייל. או סתם לצמא.', vibe_en:'Cocktail base. Or just for thirst.', active:true },
          { id:'so3', he:'ספרייט', en:'Sprite', price:'12 ₪', emoji:'💚', vibe_he:'קל, תוסס, מרענן.', vibe_en:'Light, fizzy, refreshing.', active:true },
          { id:'so4', he:'לימונדה', en:'Lemonade', price:'25 ₪', emoji:'🍋', vibe_he:'טרייה, חמצמצה, עשויה פה.', vibe_en:'Fresh, tangy, made right here.', active:true },
          { id:'so5', he:'לימונדה + ערק', en:'Lemonade + Arak', price:'37 ₪', emoji:'🌿', vibe_he:'הקוקטייל הישראלי שלא רשום בשום מקום אבל כולם מכירים.', vibe_en:'The Israeli cocktail written nowhere but everyone knows.', active:true },
        ]
      }
    ]
  },
  coffee: {
    icon: '☕', label_he: 'קפה', label_en: 'Coffee',
    subcats: [
      {
        title_he: 'קפה חם', title_en: 'Hot Coffee',
        items: [
          { id:'cf1', he:"קפוצ'ינו גדול", en:'Cappuccino Large', price:'18 ₪', emoji:'☕', vibe_he:'קצף, חלב, אספרסו. הגדול כי כן.', vibe_en:'Foam, milk, espresso. Large because why not.', note_he:"אפוג' · גדול", note_en:'Afuj · Large', active:true },
          { id:'cf2', he:"קפוצ'ינו קטן", en:'Cappuccino Small', price:'14 ₪', emoji:'☕', vibe_he:'אותו הדבר, רק קטן יותר.', vibe_en:'Same thing, just smaller.', note_he:"אפוג' · קטן", note_en:'Afuj · Small', active:true },
          { id:'cf3', he:'אמריקנו', en:'Americano', price:'15 ₪', emoji:'☕', vibe_he:'אספרסו עם מים. ארוך ורגוע.', vibe_en:'Espresso with water. Long and calm.', active:true },
          { id:'cf4', he:'אספרסו', en:'Espresso', price:'10 ₪', emoji:'⚡', vibe_he:'קצר, חזק, מדויק. כמו שצריך.', vibe_en:'Short, strong, precise. As it should be.', active:true },
          { id:'cf5', he:'לונגו', en:'Lungo', price:'12 ₪', emoji:'☕', vibe_he:'אספרסו ארוך. למי שרוצה יותר.', vibe_en:'Long espresso. For those who want more.', active:true },
          { id:'cf6', he:'מקיאטו', en:'Macchiato', price:'12 ₪', emoji:'🤎', vibe_he:'אספרסו עם כתם חלב. קטן ומדויק.', vibe_en:'Espresso with a milk stain. Small and precise.', active:true },
        ]
      },
      {
        title_he: 'תה הבית', title_en: 'House Tea',
        items: [
          { id:'t1', he:'תה הבית', en:'House Tea', price:'15 ₪', emoji:'🍵', vibe_he:'מנטה, קינמון, דבש ולימון. כמו שסבתא הייתה מכינה.', vibe_en:"Mint, cinnamon, honey and lemon. Like grandma used to make.", note_he:'מנטה · קינמון · דבש · לימון', note_en:'Mint · Cinnamon · Honey · Lemon', active:true, popular:true },
        ]
      },
      {
        title_he: 'קפה קר', title_en: 'Iced Coffee',
        items: [
          { id:'ic1', he:'קפה קר', en:'Iced Coffee', price:'17 ₪', emoji:'🧊', vibe_he:'ישראל מדינת הקפה הקר. אנחנו מצטרפים.', vibe_en:"Israel is an iced coffee nation. We're in.", note_he:'עם/בלי חלב', note_en:'With/without milk', active:true },
        ]
      }
    ]
  },
  food: {
    icon: '🍕', label_he: 'אוכל', label_en: 'Food',
    subcats: [
      {
        title_he: "תפס אותי המאנצ'", title_en: 'Munchies',
        items: [
          { id:'f1', he:'פיצה', en:'Pizza Slice', price:'45 ₪', emoji:'🍕', img: null, vibe_he:'חתיכה חמה מהתנור. הכל מה שצריך עם בירה.', vibe_en:'A hot slice from the oven. Everything you need with a beer.', note_he:'מהתנור · תמיד טרייה', note_en:'From the oven · always fresh', active:true },
          { id:'f2', he:'אדממה', en:'Edamame', price:'15 ₪', emoji:'🫘', img: null, vibe_he:'פולי סויה מלוחים. הולך טוב עם כל בירה.', vibe_en:'Salted soy beans. Goes with every beer.', note_he:'מלוח · 80 גרם', note_en:'Salted · 80g', active:true },
          { id:'f3', he:'עוגיות', en:'Cookies', price:'10 ₪', emoji:'🍪', vibe_he:'כי לפעמים יש מתוק.', vibe_en:'Because sometimes you need something sweet.', active:true },
          { id:'f4', he:'סלט', en:'Salad', price:'35 ₪', emoji:'🥗', vibe_he:'כי יש כאלה. טרי, פשוט, טעים.', vibe_en:'For those who need it. Fresh, simple, good.', active:true },
        ]
      }
    ]
  },
  morning: {
    icon: '☀️', label_he: 'בוקר', label_en: 'Morning',
    subcats: [
      {
        title_he: 'שישי בוקר · 09:00–17:00', title_en: 'Friday Morning · 09:00–17:00',
        items: [
          { id:'mo1', he:'אייס קפה', en:'Ice Coffee', price:'18–22 ₪', emoji:'🧊', vibe_he:'קפה קר בנחלאות. הדבר הכי ישראלי שיש.', vibe_en:'Cold coffee in Nachlaot. The most Israeli thing there is.', note_he:'עם/בלי חלב', note_en:'With or without milk', active:true },
          { id:'mo2', he:"מאצ'ה לאטה", en:'Matcha Latte', price:'20–26 ₪', emoji:'🍵', vibe_he:'ירוק, עשבוני, אנרגטי. לא כמו כולם.', vibe_en:'Green, earthy, energizing. Not like everyone else.', note_he:'חם או קר', note_en:'Hot or cold', active:true },
          { id:'mo3', he:"קפוצ'ינו", en:'Cappuccino', price:'14–18 ₪', emoji:'☕', vibe_he:"כי בוקר שישי בלי קפוצ'ינו זה לא בוקר שישי.", vibe_en:"Because Friday morning without a cappuccino isn't Friday morning.", note_he:"גדול/קטן · אפוג'", note_en:'Large/Small · Afuj', active:true },
          { id:'mo4', he:'תה הבית', en:'House Tea', price:'15 ₪', emoji:'🍵', vibe_he:'מנטה, קינמון, דבש ולימון. שקט, חם, נחלאות בכוס.', vibe_en:'Mint, cinnamon, honey, lemon. Quiet, warm, Nachlaot in a cup.', active:true },
        ]
      }
    ]
  }
}
