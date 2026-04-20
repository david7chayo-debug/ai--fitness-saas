# PHASE 2 — VALIDATION PLAN

**Product**: Narratify — AI-Narrated Marketing Reports for Agencies  
**Validation window**: 72 hours from landing page live  
**Goal**: 5 strong signals (corporate/agency email on waitlist, DM conversation with prospect, or pre-payment)

---

## What "Strong Signal" Means

| Signal Type | Weight | Example |
|---|---|---|
| Pre-payment (founding member) | 5/5 | Stripe payment link clicked + completed |
| Waitlist with agency email | 3/5 | @agencyname.com or @clientname.com |
| Direct conversation (DM/email) | 3/5 | Prospect asks pricing or demo questions |
| Generic email signup | 1/5 | @gmail.com with no follow-up |

Target: ≥5 weighted signals. If only generic emails, pivot is triggered.

---

## Hour-by-Hour Launch Sequence (72 hours)

### Hour 0–4: Go Live
1. Deploy landing page to Vercel (push branch → auto-deploy)
2. Set up Supabase `waitlist` table:
   ```sql
   create table waitlist (
     id uuid default gen_random_uuid() primary key,
     email text unique not null,
     agency_size text,
     source text default 'landing',
     created_at timestamptz default now()
   );
   alter table waitlist enable row level security;
   -- Service role only (no public insert via anon key)
   ```
3. Verify email capture works end-to-end
4. Set up Resend free tier — configure sender domain for confirmation emails

### Hour 4–24: Facebook Group Outreach (Primary Channel)

**Groups to join immediately**:
- "Digital Agency Owners" — 180K members
- "Agency Growth Hackers" — 90K members  
- "Digital Marketing Questions" — 150K+ members
- "PPC Advertising - Google Ads & Facebook Ads" — 80K members

**Outreach script (respond to existing threads, don't cold post)**:

Find posts matching:
- "How do you handle client reporting?"
- "Anyone else finding [AgencyAnalytics/Whatagraph] too expensive?"
- "What's your process for monthly reports?"
- "How long does your reporting take each month?"

**Reply template**:
```
We've been in exactly the same boat — I was spending every Friday pulling GA4 / 
Meta / Google Ads into decks. Built a tool that writes the narrative explanation 
automatically, white-labeled under your agency. Still in early access but happy 
to show you a demo if you're curious.
```

Do NOT post promotional links. Comment naturally, invite DMs. DMs = strong signal.

### Hour 24–48: Reddit Engagement

**Subreddits**:
- r/PPC (120K members)
- r/digital_marketing (170K members)  
- r/SEO (400K members)
- r/agency (niche but highly relevant)

**Approach**: Answer existing reporting questions with genuine advice, mention you're building a tool at the end. Get karma first, promote second.

**Reddit post to write** (r/agency or r/digital_marketing):
```
Title: "I tracked how long monthly client reporting takes us — the result was embarrassing"

Post: Ran a time audit last month. We have 22 clients. Average time per client report: 
4.5 hours. That's 99 hours/month = 2.5 full working weeks, every month, just on reports.

The actual work breakdown:
- Pulling from GA4: 45min
- Pulling from Google Ads: 30min
- Pulling from Meta: 30min  
- Building the deck/PDF: 45min
- Writing the "what this means" section: 90min ← this is the killer

Curious what others are doing. We're building something to automate the last part 
(the AI writes the narrative explanation). Happy to share early access if anyone wants to try it.
```

This format generates real engagement and validates demand without being an ad.

### Hour 48–72: Cold Email Outreach

**Source**: Clutch.co agency directory (free, sortable by specialty and size)
Filter: Digital marketing agencies, 10–49 employees, English-speaking markets

**Email Template**:
```
Subject: Reporting question for [Agency Name]

Hi [First Name],

Found your agency on Clutch — congrats on the reviews.

Quick question: how long does your team spend on monthly client reporting? 
(Pulling from GA4/Meta/Google Ads, building decks, writing the commentary section)

I ask because we're building Narratify — an AI tool that writes the narrative 
section of client reports automatically, white-labeled under your brand. 
Considering you manage [X] clients (from your Clutch profile), you're 
probably losing 60–100 hours/month to this.

We're in early access and giving free 30-day trials to 10 agencies this month. 
Want to see it in action with your actual GA4 data?

[Name]
```

Volume: 50 emails/day × 3 days = 150 emails. Expected at 5% reply rate = 7–8 conversations.

---

## Pivot Criteria (if signals < 5 after 72h)

If we fail to get 5 strong signals:

**Pivot Option A**: Narrow the ICP  
→ Instead of all agencies, target specifically PPC/paid media agencies  
→ Pain is more acute (ad spend reporting = higher stakes, faster decisions needed)  
→ Find them: Google Partners directory, Facebook Marketing Partners list

**Pivot Option B**: Change the offer  
→ Instead of "join waitlist," offer: "Send me your GA4 access and I'll generate your first report manually in 24h" (do things that don't scale first)  
→ This forces real conversations and validates willingness to share data

**Pivot Option C**: Switch to Invoice Chaser (#2 on the list)  
→ Same buyer accessibility tactics apply  
→ Pain is even more visceral (cash flow)  
→ No data-sharing friction (connect accounting software, not analytics)

---

## Validation Metrics to Track

| Metric | Target (72h) | Actual |
|---|---|---|
| Landing page visits | 200+ | TBD |
| Waitlist signups | 15+ | TBD |
| Agency-email signups | 5+ | TBD |
| DM/email conversations | 3+ | TBD |
| Pre-payments | 1+ (bonus) | TBD |

**Minimum to proceed to full build**: 5 agency-email signups OR 3 direct conversations showing genuine interest.

---

## Tools Needed (all free tier)

- **Vercel**: Deploy (free)
- **Supabase**: Waitlist storage (free)
- **Resend**: Confirmation email on signup (free up to 3K/mo)
- **Plausible/PostHog**: Page analytics to see visit→signup conversion (free tier)
- **Hunter.io**: Find agency contact emails from Clutch (free 25/mo)
- **Apollo.io**: Supplemental email finding (free 50/mo)

---

## Confirmation Email (via Resend, trigger on waitlist insert)

```
Subject: You're on the Narratify early access list ✓

Hey there,

You're in. We're giving early access to a small group of agencies first — 
you're on that list.

What to expect:
→ In the next 2 weeks: an invite to try Narratify with your real data
→ Founding member pricing: locked in for life (no price increases, ever)
→ Direct line to the founder: reply to this email if you have questions

What we're building: AI-written narrative client reports. Connect your 
GA4, Google Ads, and Meta. We write the "what happened and why" section 
automatically, white-labeled under your agency.

The average agency we've talked to spends 4–6 hours per client per month 
on reporting. We're bringing that to under 10 minutes.

Talk soon,
[Founder]
Narratify
```
