# TimeLoop Chrome Extension

Track your browser activity and send data to TimeLoop productivity app.

## 🆕 Features

### 📜 Visit History Queue
- **Real-time tracking**: See exactly which tabs you visited and when
- **Duration tracking**: Know how long you spent on each page
- **Chronological queue**: Most recent visits appear first
- **Detailed information**: Shows page title, domain, timestamp, and duration
- **Clear history**: Remove local history with one click

### 📊 Activity Summary
- **Aggregate stats**: Total time spent per domain
- **Visit counts**: Track how many times you visited each site
- **Top 10 sites**: See your most-visited websites
- **Auto-sync**: Data syncs to TimeLoop backend every 5 minutes

### ⏱️ How It Works

1. **Automatic Tracking**: 
   - Tracks active tab changes
   - Records time spent (minimum 3 seconds)
   - Captures page title, URL, and domain

2. **Visit Queue**:
   - Each visit is added to a queue (last 100 visits)
   - Shows recent activity in chronological order
   - Includes relative timestamps (e.g., "5m ago")

3. **Summary Stats**:
   - Aggregates time by domain
   - Shows total hours/minutes spent
   - Displays visit counts

4. **Background Sync**:
   - Syncs to backend every 5 minutes
   - Manual sync available with "Sync Now" button
   - Only syncs domains with 1+ minute of activity

## Features

- 🕐 **Automatic Time Tracking**: Tracks time spent on each website
- 📊 **Real-time Stats**: See your browsing activity in the popup
- 📜 **Visit History**: View detailed queue of recent page visits
- ☁️ **Auto Sync**: Syncs data to TimeLoop backend every 5 minutes
- 🔒 **Privacy Focused**: Only tracks domain-level data, not specific pages

## Installation

### Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `/app/chrome-extension` folder
5. The TimeLoop Tracker extension should now appear in your extensions list

### Configuration

1. Click the TimeLoop extension icon in your browser toolbar
2. Enter your User ID (find this in your TimeLoop dashboard)
3. Click "Save Configuration"
4. The extension will start tracking automatically!

## 🎯 Using the Extension

### Tabs Overview

**📜 History Tab (Default)**:
- Shows your recent browsing activity in a queue
- Each entry displays:
  - Page title
  - Domain name
  - Time visited (relative, e.g., "5m ago")
  - Duration spent
- Click "Clear" to remove local history
- Keeps last 100 visits

**📊 Summary Tab**:
- Shows aggregate statistics per domain
- Total time spent on each site
- Sorted by most time spent
- Top 10 domains displayed

### Features

**Save Configuration**:
- Saves your User ID for syncing
- Required for data to reach TimeLoop backend

**Sync Now**:
- Manually trigger sync to backend
- Useful for immediate data upload
- Clears local tracking data after successful sync

**Clear History**:
- Removes local visit history
- Does not affect synced data on backend
- Summary stats are preserved until synced

## How It Works

### Background Tracking

The extension uses a background service worker that:
- Monitors active tab changes
- Tracks time spent on each domain
- Stores data locally in Chrome storage
- Syncs to backend API every 5 minutes

### Visit Queue Structure

Each visit in the history contains:
```javascript
{
  id: 1234567890,
  domain: "github.com",
  title: "GitHub - Project Repository",
  url: "https://github.com/user/repo",
  duration: 45,  // seconds
  timestamp: "2024-03-26T10:30:00.000Z",
  startTime: "2024-03-26T10:29:15.000Z"
}
```

### Data Structure

Aggregate data sent to backend:
```json
{
  "userId": "your-user-id",
  "website": "example.com",
  "url": "https://example.com/page",
  "timeSpent": 15,
  "timestamp": "2024-06-15T10:30:00.000Z"
}
```

- `timeSpent` is in minutes
- Only domains with 1+ minute of activity are synced
- Visit history is local only (not synced)

## API Endpoint

The extension sends data to:
```
POST https://productivity-ai-35.preview.emergentagent.com/api/activity-log
```

## Files

- `manifest.json` - Extension configuration (V3)
- `background.js` - Service worker for tracking and queue management
- `popup.html` - Extension popup UI with tabs
- `popup.js` - Popup functionality and data visualization
- `icon*.png` - Extension icons (placeholder - add your own)

## Getting Your User ID

1. Sign in to TimeLoop at https://productivity-ai-35.preview.emergentagent.com
2. Go to your dashboard
3. Your User ID is shown in the extension configuration help
4. Copy and paste it into the extension popup

## 🔒 Privacy

- The extension only tracks:
  - Domain names (e.g., "github.com")
  - Time spent on each domain
  - Page titles (stored locally only)
- Visit history is stored locally in Chrome
- Only aggregate data syncs to TimeLoop
- You can clear local history anytime
- Data is sent only to your TimeLoop account

## Troubleshooting

**Extension not tracking:**
- Make sure you've entered your User ID
- Check that the extension has permissions
- Look at console logs in background.js
- Ensure you're on a non-chrome:// page

**Data not syncing:**
- Verify your User ID is correct
- Check internet connection
- Try manual sync from popup
- Check if backend is accessible

**History not showing:**
- Ensure you've browsed for at least 3 seconds per page
- Check Chrome storage: `chrome.storage.local.get(['visitHistory'])`
- Try refreshing the popup

**To view logs:**
1. Go to `chrome://extensions/`
2. Find TimeLoop Tracker
3. Click "service worker" link
4. View console logs

## Development

To modify the extension:
1. Edit files in `/app/chrome-extension/`
2. Go to `chrome://extensions/`
3. Click the reload icon on TimeLoop Tracker
4. Test the changes

### Key Modifications

**Change sync interval:**
Edit `SYNC_INTERVAL` in `background.js` (in minutes)

**Change minimum tracking time:**
Edit the condition in `saveCurrentTabTime()` function

**Change history size:**
Edit the splice limit in `saveCurrentTabTime()` function (default 100)

**Customize UI:**
Edit styles in `popup.html` `<style>` section

## 🎨 UI Features

- **Two-tab interface**: History and Summary
- **Real-time updates**: Data refreshes every 5 seconds
- **Relative timestamps**: Shows "5m ago", "2h ago", etc.
- **Duration formatting**: Displays as "1h 30m", "45m", or "30s"
- **Gradient design**: Beautiful purple gradient theme
- **Responsive**: Works in 400px popup width
- **Scrollable**: History scrolls for long lists

## Support

For issues or questions, contact TimeLoop support or open an issue in the repository.

---

**Version**: 1.0.0  
**Manifest**: V3  
**Permissions**: tabs, storage, alarms, all_urls
