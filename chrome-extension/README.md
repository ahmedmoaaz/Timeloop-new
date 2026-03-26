# TimeLoop Chrome Extension

Track your browser activity and send data to TimeLoop productivity app.

## Features

- 🕐 **Automatic Time Tracking**: Tracks time spent on each website
- 📊 **Real-time Stats**: See your browsing activity in the popup
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

## How It Works

### Background Tracking

The extension uses a background service worker that:
- Monitors active tab changes
- Tracks time spent on each domain
- Stores data locally in Chrome storage
- Syncs to backend API every 5 minutes

### Data Structure

Data sent to backend:
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

## API Endpoint

The extension sends data to:
```
POST https://productivity-ai-35.preview.emergentagent.com/api/activity-log
```

## Files

- `manifest.json` - Extension configuration
- `background.js` - Service worker for tracking
- `popup.html` - Extension popup UI
- `popup.js` - Popup functionality
- `icon*.png` - Extension icons (placeholder - add your own)

## Getting Your User ID

1. Sign in to TimeLoop at https://productivity-ai-35.preview.emergentagent.com
2. Go to your dashboard
3. Your User ID is available in your account settings
4. Copy and paste it into the extension popup

## Privacy

- The extension only tracks domain names and time spent
- No personal browsing data is collected
- Data is sent only to your TimeLoop account
- You can clear local data anytime from the extension popup

## Troubleshooting

**Extension not tracking:**
- Make sure you've entered your User ID
- Check that the extension has permissions
- Look at console logs in background.js

**Data not syncing:**
- Verify your User ID is correct
- Check internet connection
- Try manual sync from popup

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

## Support

For issues or questions, contact TimeLoop support or open an issue in the repository.
