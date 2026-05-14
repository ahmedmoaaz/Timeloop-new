// TEST VERSION - Chrome Extension Background with Enhanced Logging
// Use this version to debug tracking issues

const API_URL = 'https://productivity-ai-35.preview.emergentagent.com/api/activity-log';
const SYNC_INTERVAL = 5; // minutes

let currentTab = null;
let startTime = null;
let timeTracking = {};
let visitHistory = [];

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 TimeLoop Tracker installed/updated');
  chrome.storage.local.set({ timeTracking: {}, visitHistory: [] });
  
  // Create alarm for periodic sync
  chrome.alarms.create('syncData', { periodInMinutes: SYNC_INTERVAL });
  console.log('⏰ Sync alarm created (every 5 minutes)');
});

// Track active tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('🔄 Tab activated:', activeInfo.tabId);
  await saveCurrentTabTime();
  
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    console.log('📄 Tab info:', { url: tab.url, title: tab.title });
    
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      try {
        const url = new URL(tab.url);
        currentTab = {
          url: tab.url,
          title: tab.title,
          domain: url.hostname
        };
        startTime = Date.now();
        console.log('✅ Started tracking:', currentTab.domain, 'at', new Date(startTime).toLocaleTimeString());
      } catch (e) {
        console.error('❌ Invalid URL:', tab.url, e);
      }
    } else {
      console.log('⏭️ Skipping chrome:// or extension page');
    }
  } catch (error) {
    console.error('❌ Error getting tab:', error);
  }
});

// Track tab updates (URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    console.log('🔄 Tab updated (complete):', tab.url);
    await saveCurrentTabTime();
    
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      try {
        const url = new URL(tab.url);
        currentTab = {
          url: tab.url,
          title: tab.title,
          domain: url.hostname
        };
        startTime = Date.now();
        console.log('✅ Started tracking (update):', currentTab.domain, 'at', new Date(startTime).toLocaleTimeString());
      } catch (e) {
        console.error('❌ Invalid URL:', tab.url, e);
      }
    }
  }
});

// Track window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    console.log('👋 Browser lost focus');
    await saveCurrentTabTime();
    currentTab = null;
    startTime = null;
  } else {
    console.log('👀 Browser gained focus');
    try {
      const [tab] = await chrome.tabs.query({ active: true, windowId });
      if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        try {
          const url = new URL(tab.url);
          currentTab = {
            url: tab.url,
            title: tab.title,
            domain: url.hostname
          };
          startTime = Date.now();
          console.log('✅ Started tracking (focus):', currentTab.domain, 'at', new Date(startTime).toLocaleTimeString());
        } catch (e) {
          console.error('❌ Invalid URL:', tab.url, e);
        }
      }
    } catch (error) {
      console.error('❌ Error in focus handler:', error);
    }
  }
});

// Save time spent on current tab
async function saveCurrentTabTime() {
  if (!currentTab || !startTime) {
    console.log('⏭️ Nothing to save (no current tab or start time)');
    return;
  }
  
  const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds
  console.log('⏱️ Time spent on', currentTab.domain, ':', timeSpent, 'seconds');
  
  if (timeSpent < 3) {
    console.log('⏭️ Too short, skipping (< 3 seconds)');
    currentTab = null;
    startTime = null;
    return;
  }
  
  try {
    const storage = await chrome.storage.local.get(['timeTracking', 'visitHistory']);
    const tracking = storage.timeTracking || {};
    const history = storage.visitHistory || [];
    const domain = currentTab.domain;
    
    // Update aggregate tracking
    if (!tracking[domain]) {
      tracking[domain] = {
        domain,
        totalTime: 0,
        visits: 0,
        lastUrl: currentTab.url,
        lastTitle: currentTab.title
      };
    }
    
    tracking[domain].totalTime += timeSpent;
    tracking[domain].visits += 1;
    tracking[domain].lastUrl = currentTab.url;
    tracking[domain].lastTitle = currentTab.title;
    
    console.log('📊 Updated tracking for', domain, ':', {
      totalTime: tracking[domain].totalTime,
      visits: tracking[domain].visits
    });
    
    // Add to visit history queue
    const visit = {
      id: Date.now(),
      domain,
      title: currentTab.title || domain,
      url: currentTab.url,
      duration: timeSpent,
      timestamp: new Date().toISOString(),
      startTime: new Date(startTime).toISOString()
    };
    
    history.unshift(visit); // Add to beginning of queue
    
    // Keep only last 100 visits
    if (history.length > 100) {
      history.splice(100);
    }
    
    console.log('📝 Added to history:', {
      domain: visit.domain,
      duration: visit.duration,
      historyLength: history.length
    });
    
    await chrome.storage.local.set({ 
      timeTracking: tracking,
      visitHistory: history
    });
    
    console.log('💾 Saved to storage successfully');
    
  } catch (error) {
    console.error('❌ Error saving visit:', error);
  }
  
  currentTab = null;
  startTime = null;
}

// Sync data to backend
async function syncDataToBackend() {
  console.log('🔄 Starting sync to backend...');
  
  const { timeTracking: tracking, userId } = await chrome.storage.local.get(['timeTracking', 'userId']);
  
  if (!userId) {
    console.log('⚠️ No user ID set. Skipping sync.');
    return;
  }
  
  if (!tracking || Object.keys(tracking).length === 0) {
    console.log('⚠️ No data to sync');
    return;
  }
  
  console.log('📤 Syncing', Object.keys(tracking).length, 'domains');
  
  // Send each domain's data
  for (const domain in tracking) {
    const data = tracking[domain];
    const timeInMinutes = Math.floor(data.totalTime / 60);
    
    if (timeInMinutes < 1) {
      console.log('⏭️ Skipping', domain, '(< 1 minute)');
      continue;
    }
    
    try {
      console.log('📤 Syncing', domain, ':', timeInMinutes, 'minutes');
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          website: domain,
          url: data.lastUrl,
          timeSpent: timeInMinutes,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log('✅ Synced', domain, 'successfully');
        delete tracking[domain];
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to sync', domain, ':', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error syncing', domain, ':', error);
    }
  }
  
  // Update storage with remaining data
  await chrome.storage.local.set({ timeTracking: tracking });
  console.log('✅ Sync complete');
}

// Listen for alarm to sync data
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncData') {
    console.log('⏰ Sync alarm triggered');
    syncDataToBackend();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Message received:', request.action);
  
  if (request.action === 'getStats') {
    chrome.storage.local.get(['timeTracking', 'visitHistory'], (result) => {
      console.log('📊 Sending stats:', {
        domains: Object.keys(result.timeTracking || {}).length,
        visits: (result.visitHistory || []).length
      });
      sendResponse({ 
        stats: result.timeTracking || {},
        history: result.visitHistory || []
      });
    });
    return true;
  } else if (request.action === 'syncNow') {
    console.log('🔄 Manual sync requested');
    syncDataToBackend().then(() => {
      sendResponse({ success: true });
    });
    return true;
  } else if (request.action === 'clearHistory') {
    console.log('🗑️ Clear history requested');
    chrome.storage.local.set({ visitHistory: [] }, () => {
      console.log('✅ History cleared');
      sendResponse({ success: true });
    });
    return true;
  }
});

// Log when service worker starts
console.log('🚀 TimeLoop Tracker service worker started');
console.log('📍 API URL:', API_URL);
console.log('⏰ Sync interval:', SYNC_INTERVAL, 'minutes');
