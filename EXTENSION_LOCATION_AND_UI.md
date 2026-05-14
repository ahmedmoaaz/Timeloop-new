# 📍 Where is the Chrome Extension?

## 🗂️ File Location

The extension files are located at:
```
/app/chrome-extension/
```

### Files in the Extension:
```
chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Main tracking logic
├── background-debug.js    # Debug version with logs
├── popup.html            # UI you see when clicking icon
├── popup.js              # UI functionality
├── icon16.png            # Small icon (placeholder)
├── icon48.png            # Medium icon (placeholder)
├── icon128.png           # Large icon (placeholder)
└── README.md             # Documentation
```

---

## 🎯 How to Find the Extension in Chrome

### Step 1: Open Extensions Page
Go to: `chrome://extensions/`

OR

Click: ⋮ (three dots) → Extensions → Manage Extensions

### Step 2: Find TimeLoop Tracker
Look for a card that says:
```
TimeLoop Tracker
Track your website activity and send data to TimeLoop
```

### Step 3: Extension Icon Location
After installing, the extension icon appears in:
- **Chrome toolbar** (top right, next to address bar)
- May be hidden in the puzzle piece icon 🧩
- Click 🧩 → Find "TimeLoop Tracker" → Click pin 📌 to show in toolbar

---

## 🖼️ What the Extension Looks Like

### In Chrome Extensions Page:
```
┌─────────────────────────────────────────────┐
│ TimeLoop Tracker                      ⚫ ON │
│ Track your website activity...              │
│                                              │
│ [Details] [Remove]    🔄 ⚙️                │
│                                              │
│ ID: abcd1234...                             │
│ Version: 1.0.0                              │
│ service worker                              │
└─────────────────────────────────────────────┘
```

### In Chrome Toolbar:
```
[Profile] [Extensions 🧩] [⏰ TimeLoop] [...] 
```
Click the ⏰ icon to open the popup!

---

## 🎨 New UI Features (Just Added!)

### When You Click the Extension Icon, You'll See:

```
┌──────────────────────────────────────────┐
│  ⏰ TimeLoop Tracker                     │
├──────────────────────────────────────────┤
│ Your User ID                             │
│ [_________________________________]      │
│                                          │
│ [Save Configuration]                     │
│ [Sync Now]                               │
│                                          │
│ [📜 History] [📊 Summary] [🔍 Debug]    │ ← NEW TABS!
├──────────────────────────────────────────┤
│ 🔍 Debug Tab Shows:                      │
│                                          │
│ ⚙️ CONFIGURATION                         │
│ • User ID: [your-id] ✓ Configured       │
│ • Current Tab: youtube.com               │
│                                          │
│ 📊 TRACKING STATUS                       │
│ • Visit History: 5 visits ✓ Active      │
│ • Domains Tracked: 3 domains             │
│ • Total Time: 15m 30s                    │
│                                          │
│ 🔍 RECENT ACTIVITY                       │
│ • Last Visit: youtube.com                │
│ • Duration: 2m 30s                       │
│ • When: 5m ago                           │
│                                          │
│ 💡 TIPS                                  │
│ • ✅ Extension is tracking!              │
│ • 💡 Visit must be 3+ seconds            │
│ • 💡 Data saves when you switch tabs     │
│                                          │
│ 🔧 STORAGE DETAILS                       │
│ • History Size: 5/100 max                │
│ • Pending Sync: 3 domains                │
└──────────────────────────────────────────┘
```

---

## 🚀 How to Install/Reload the Extension

### First Time Installation:
1. Open Chrome
2. Go to `chrome://extensions/`
3. Turn ON "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Navigate to `/app/chrome-extension/`
6. Click "Select Folder"
7. Extension is now installed! ✅

### After Making Changes:
1. Go to `chrome://extensions/`
2. Find "TimeLoop Tracker"
3. Click the 🔄 **reload icon**
4. Changes applied! ✅

---

## 🔍 How to See Logs in the UI

### NEW: Debug Tab in Popup!
1. Click the extension icon ⏰
2. Click the **🔍 Debug** tab
3. You'll see:
   - ✅ Configuration status
   - 📊 Tracking stats
   - 🔍 Recent activity
   - 💡 Helpful tips
   - 🔧 Storage details

### Click "Refresh" to Update Debug Info
The debug tab auto-refreshes every 5 seconds, or click the "Refresh" button manually.

---

## 📊 What Each Tab Shows

### 📜 History Tab
- Recent visits queue (last 100)
- Page titles
- Domains
- Timestamps (e.g., "5m ago")
- Durations (e.g., "2m 30s")
- [Clear] button to remove history

### 📊 Summary Tab
- Aggregate time per domain
- Total visits per site
- Top 10 most-visited sites
- Sorted by time spent

### 🔍 Debug Tab (NEW!)
- Configuration check
- Current tab info
- Tracking status
- Recent activity details
- Storage usage
- Helpful tips
- Status indicators (✓ ⚠ ✗)

---

## 🎯 Quick Test

### To Test If Extension is Working:

1. **Install/Reload** the extension
2. **Click the icon** ⏰
3. **Go to Debug tab** 🔍
4. You should see:
   - Configuration status
   - Current tab URL
   - Tracking indicators

5. **Browse to YouTube**
6. **Stay for 10 seconds**
7. **Switch to another tab** (important!)
8. **Click extension icon again**
9. **Check History tab** 📜
10. You should see your YouTube visit!

---

## ⚠️ Important Notes

### The Extension Saves When:
- ✅ You switch tabs
- ✅ You close a tab
- ✅ Browser loses focus
- ❌ NOT when watching videos on same tab

### Minimum Tracking Time:
- Must stay on page for **3+ seconds**
- Shorter visits are ignored

### Data Storage:
- **Local**: Last 100 visits + aggregate stats
- **Synced**: Only aggregate time per domain
- **Auto-sync**: Every 5 minutes

---

## 🐛 Debug Checklist

Use the **Debug tab** to verify:

- [ ] User ID is set (shows ✓ Configured)
- [ ] Visit History count > 0
- [ ] Tracking Status shows ✓ Active
- [ ] Last Visit shows recent activity
- [ ] Tips show green ✅ message

If any show ⚠️ or ✗, follow the tip messages!

---

## 📝 Still Having Issues?

### Check the Debug Tab First!
The debug tab will show you exactly what's wrong:
- ⚠️ Not configured → Set User ID
- ⚠️ No data yet → Browse and switch tabs
- ✓ Everything working → You're good!

### Console Logs (Advanced)
1. Go to `chrome://extensions/`
2. Click "service worker" under TimeLoop Tracker
3. See detailed console logs

---

**The extension is now at `/app/chrome-extension/` with a built-in debug UI!** 🎉

Just reload the extension and check the Debug tab to see everything that's happening!
