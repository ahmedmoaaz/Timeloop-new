# AI Insights Setup Guide

## 🚨 Current Issue

The AI Insights feature is not working because:

**Error**: `429 - You exceeded your current quota`

This means the OpenAI API key currently in your `.env` file has **run out of credits** or **exceeded its free quota**.

---

## ✅ How to Fix It

### Option 1: Add Credits to Your OpenAI Account (Recommended)

1. **Go to OpenAI Platform**:
   - Visit: https://platform.openai.com/account/billing

2. **Add Payment Method**:
   - Click "Add payment method"
   - Add a credit/debit card

3. **Add Credits** (Optional):
   - You can add prepaid credits (e.g., $5, $10, $20)
   - Or just enable auto-recharge

4. **Wait 2-5 minutes** for the quota to refresh

5. **Test in TimeLoop**:
   - Go to "AI Insights" tab
   - Click "Generate Daily Summary"
   - Should work now!

**Cost**: GPT-4o-mini is very cheap (~$0.01 per summary)

---

### Option 2: Use Emergent's LLM Key (If Available)

If you have access to Emergent's universal LLM key:

1. **Get the Key**:
   ```bash
   # I can fetch it for you if you confirm
   ```

2. **Update .env**:
   ```bash
   OPENAI_API_KEY=<emergent-key>
   ```

3. **Restart the server**:
   ```bash
   sudo supervisorctl restart nextjs
   ```

---

### Option 3: Get a New OpenAI API Key

1. **Go to OpenAI**:
   - Visit: https://platform.openai.com/api-keys

2. **Create New Secret Key**:
   - Click "Create new secret key"
   - Name it (e.g., "TimeLoop App")
   - Copy the key (starts with `sk-proj-...`)

3. **Add Billing** (Required):
   - Go to https://platform.openai.com/account/billing
   - Add payment method
   - Add at least $5 in credits

4. **Update TimeLoop**:
   - Replace the `OPENAI_API_KEY` in `/app/.env` with your new key
   - Restart: `sudo supervisorctl restart nextjs`

---

## 🧪 Testing

After fixing the API key:

1. Go to **AI Insights** tab
2. Click **"Generate Daily Summary"** button
3. Wait 5-10 seconds
4. You should see:
   - AI-generated summary of your productivity
   - Stats (event count, top activities)
   - Actionable suggestions

---

## 📊 What AI Insights Provides

The AI analyzes:
- ✅ All your logged events (title, content, tags, time)
- ✅ Browser activity from Chrome extension
- ✅ Time spent on different activities
- ✅ Productivity patterns

And gives you:
- 📝 3-4 sentence encouraging summary
- 💡 Actionable improvement suggestions
- 📈 Top activities and websites
- 🎯 Motivating insights

---

## 💰 Cost Estimate

Using GPT-4o-mini:
- **Per summary**: ~$0.005 - $0.01 (less than 1 cent)
- **100 summaries**: ~$0.50 - $1.00
- **Very affordable** for daily/weekly use!

---

## 🔧 Current OpenAI Key Status

Your current key ending in `...JcsA` has:
- ❌ Exceeded quota (429 error)
- 🔄 Needs billing/credits added

---

## 🚀 Next Steps

**Tell me which option you prefer:**

1. **"Add credits to existing key"** - I'll wait while you add billing
2. **"Use Emergent key"** - I'll fetch and configure it
3. **"Create new key"** - I'll wait while you create one

Then I can help you configure and test it!

---

**Last Updated**: May 17, 2026
