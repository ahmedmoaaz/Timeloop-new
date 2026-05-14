// TimeLoop Chrome Extension Background Service Worker

const API_URL = 'https://productivity-ai-35.preview.emergentagent.com/api/activity-log';
const SYNC_INTERVAL = 5; // minutes

let currentTab = null;
let startTime = null;
let timeTracking = {};
let visitHistory = []; // Queue to track visit history

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('TimeLoop Tracker installed');
  chrome.storage.local.set({ timeTracking: {}, visitHistory: [] });
  
  // Create alarm for periodic sync
  chrome.alarms.create('syncData', { periodInMinutes: SYNC_INTERVAL });
});

// Track active tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await saveCurrentTabTime();
  
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && !tab.url.startsWith('chrome://')) {
    currentTab = {
      url: tab.url,
      title: tab.title,
      domain: new URL(tab.url).hostname
    };
    startTime = Date.now();
  }
});

// Track tab updates (URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    await saveCurrentTabTime();
    
    if (tab.url && !tab.url.startsWith('chrome://')) {
      currentTab = {
        url: tab.url,
        title: tab.title,
        domain: new URL(tab.url).hostname
      };
      startTime = Date.now();
    }
  }
});

// Track window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    await saveCurrentTabTime();
    currentTab = null;
    startTime = null;
  } else {
    // Browser gained focus
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab && tab.url && !tab.url.startsWith('chrome://')) {
      currentTab = {
        url: tab.url,
        title: tab.title,
        domain: new URL(tab.url).hostname
      };
      startTime = Date.now();
    }
  }
});

// Save time spent on current tab
async function saveCurrentTabTime() {
  if (!currentTab || !startTime) return;
  
  const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds
  if (timeSpent < 3) return; // Ignore very short visits
  
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
  
  await chrome.storage.local.set({ 
    timeTracking: tracking,
    visitHistory: history
  });
  
  currentTab = null;
  startTime = null;
}

// Sync data to backend
async function syncDataToBackend() {
  const { timeTracking: tracking, userId } = await chrome.storage.local.get(['timeTracking', 'userId']);
  
  if (!userId) {
    console.log('No user ID set. Please configure in popup.');
    return;
  }
  
  if (!tracking || Object.keys(tracking).length === 0) {
    console.log('No data to sync');
    return;
  }
  
  // Send each domain's data
  for (const domain in tracking) {
    const data = tracking[domain];
    const timeInMinutes = Math.floor(data.totalTime / 60);
    
    if (timeInMinutes < 1) continue; // Don't send if less than 1 minute
    
    try {
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
        console.log(`Synced ${domain}: ${timeInMinutes} minutes`);
        // Clear synced data
        delete tracking[domain];
      } else {
        console.error('Failed to sync data:', await response.text());
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }
  
  // Update storage with remaining data
  await chrome.storage.local.set({ timeTracking: tracking });
}

// Listen for alarm to sync data
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncData') {
    syncDataToBackend();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    chrome.storage.local.get(['timeTracking', 'visitHistory'], (result) => {
      sendResponse({ 
        stats: result.timeTracking || {},
        history: result.visitHistory || []
      });
    });
    return true;
  } else if (request.action === 'syncNow') {
    syncDataToBackend().then(() => {
      sendResponse({ success: true });
    });
    return true;
  } else if (request.action === 'clearHistory') {
    chrome.storage.local.set({ visitHistory: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
