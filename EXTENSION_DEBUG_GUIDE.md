# Chrome Extension Debugging Guide

## Step-by-Step Troubleshooting

### Step 1: Check Extension is Loaded
1. Go to `chrome://extensions/`
2. Find "TimeLoop Tracker"
3. Make sure it's **enabled** (toggle should be blue)
4. Click the **reload icon** (circular arrow) to reload the extension

### Step 2: Check Permissions
On the extension card, you should see:
- ✅ Read and change all your data on all websites
- ✅ Display notifications

If you see warnings, click "Details" → "Permissions" → Grant all permissions

### Step 3: Open Extension Console
1. On `chrome://extensions/`
2. Find "TimeLoop Tracker"
3. Click "**service worker**" (or "background page")
4. A console window will open

### Step 4: Test Tracking
1. **Keep the console window open**
2. Go to YouTube (youtube.com)
3. Stay on YouTube for **at least 5-10 seconds**
4. Switch to a different tab (like google.com)
5. Watch the console - you should see:
   ```
   Saved visit: youtube.com, duration: X seconds
   ```

### Step 5: Check Storage
In the extension console, type:
```javascript
chrome.storage.local.get(['visitHistory', 'timeTracking'], (result) => {
  console.log('Visit History:', result.visitHistory);
  console.log('Time Tracking:', result.timeTracking);
});
```

Press Enter. You should see your data.

### Step 6: Check Extension Popup
1. Click the TimeLoop extension icon
2. Go to **History tab**
3. You should see recent visits
4. If empty, wait a few seconds and check again

## Common Issues

### Issue 1: Extension Not Tracking At All
**Symptoms**: No visits showing up
**Causes**:
- Extension not reloaded after update
- Permissions not granted
- Service worker not running

**Fix**:
1. Go to `chrome://extensions/`
2. Click reload on TimeLoop Tracker
3. Click "Details" → Check permissions
4. Click "service worker" to wake it up

### Issue 2: Short Visits Not Tracked
**Symptoms**: Only long visits show up
**Cause**: Minimum tracking time is 3 seconds

**Fix**: Stay on page for at least 5 seconds before switching

### Issue 3: Data Not Showing in Popup
**Symptoms**: Popup is empty
**Causes**:
- No data tracked yet
- Storage access issue

**Fix**:
1. Check console for errors
2. Verify storage using Step 5 above
3. Reload popup by closing and reopening it

### Issue 4: YouTube Specifically Not Working
**Symptoms**: Other sites work, YouTube doesn't
**Causes**:
- YouTube is a single-page app (SPA)
- URL changes don't trigger full page loads

**Note**: The extension should handle this, but if not:
- Make sure you're switching tabs (not just changing videos)
- The extension tracks tab switching, not in-page navigation

## Manual Test Script

Run this in the extension console to manually test:

```javascript
// Check if tracking is working
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  if (tabs[0]) {
    console.log('Current tab:', tabs[0].url);
    console.log('Title:', tabs[0].title);
  }
});

// Check storage
chrome.storage.local.get(null, (result) => {
  console.log('All storage:', result);
});

// Force a visit save (for testing)
chrome.storage.local.get(['visitHistory'], (result) => {
  const history = result.visitHistory || [];
  history.unshift({
    id: Date.now(),
    domain: 'youtube.com',
    title: 'Test YouTube Visit',
    url: 'https://youtube.com',
    duration: 30,
    timestamp: new Date().toISOString(),
    startTime: new Date(Date.now() - 30000).toISOString()
  });
  chrome.storage.local.set({ visitHistory: history }, () => {
    console.log('Test visit added!');
  });
});
```

## What Should Happen

### Normal Flow:
1. You open YouTube
2. Extension starts timer
3. You stay for 10 seconds
4. You switch to another tab
5. Extension saves the visit:
   - Duration: 10 seconds
   - Title: "YouTube"
   - Domain: youtube.com
6. Visit appears in History tab
7. Time adds to Summary tab

### Data Storage:
- **visitHistory**: Array with up to 100 visits
- **timeTracking**: Object with aggregate stats per domain

## Testing Checklist

- [ ] Extension is enabled
- [ ] Extension is reloaded after updates
- [ ] Service worker is running (check in chrome://extensions/)
- [ ] Permissions granted
- [ ] Visited YouTube for 5+ seconds
- [ ] Switched to another tab (important!)
- [ ] Waited for visit to be saved
- [ ] Opened extension popup
- [ ] Checked History tab

## Still Not Working?

If after all this it's still not working:

1. **Check browser console** (F12) for errors
2. **Copy extension logs** from service worker console
3. **Try with a simple site** like google.com first
4. **Check if other extensions** are interfering
5. **Try in incognito mode** (allow extension in incognito first)

## Quick Fix: Reinstall Extension

1. Remove extension
2. Go to `chrome://extensions/`
3. Find TimeLoop Tracker → Remove
4. Load unpacked again from `/app/chrome-extension/`
5. Grant permissions when asked
6. Test immediately

---

**Most Common Issue**: Not reloading the extension after code updates!

Always click the reload button on chrome://extensions/ after any changes.
