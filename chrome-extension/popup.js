// Popup Script for TimeLoop Chrome Extension

document.addEventListener('DOMContentLoaded', async () => {
  const userIdInput = document.getElementById('userId');
  const saveBtn = document.getElementById('saveBtn');
  const syncBtn = document.getElementById('syncBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const refreshDebugBtn = document.getElementById('refreshDebugBtn');
  const statusDiv = document.getElementById('status');
  const historyList = document.getElementById('historyList');
  const statsList = document.getElementById('statsList');
  const debugInfo = document.getElementById('debugInfo');
  
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      tabContents.forEach(content => {
        if (content.id === tabName + 'Tab') {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
  
  // Load saved user ID
  const { userId } = await chrome.storage.local.get('userId');
  if (userId) {
    userIdInput.value = userId;
  }
  
  // Load and display data
  loadData();
  
  // Save configuration
  saveBtn.addEventListener('click', async () => {
    const userId = userIdInput.value.trim();
    
    if (!userId) {
      showStatus('Please enter your User ID', 'error');
      return;
    }
    
    await chrome.storage.local.set({ userId });
    showStatus('Configuration saved successfully!', 'success');
  });
  
  // Sync now
  syncBtn.addEventListener('click', async () => {
    const { userId } = await chrome.storage.local.get('userId');
    
    if (!userId) {
      showStatus('Please configure your User ID first', 'error');
      return;
    }
    
    showStatus('Syncing data...', 'info');
    
    chrome.runtime.sendMessage({ action: 'syncNow' }, (response) => {
      if (response && response.success) {
        showStatus('Data synced successfully!', 'success');
        setTimeout(loadData, 1000);
      } else {
        showStatus('Failed to sync data', 'error');
      }
    });
  });
  
  // Clear history
  clearHistoryBtn.addEventListener('click', async () => {
    if (!confirm('Clear all visit history? This will not affect synced data.')) {
      return;
    }
    
    chrome.runtime.sendMessage({ action: 'clearHistory' }, (response) => {
      if (response && response.success) {
        showStatus('History cleared!', 'success');
        loadData();
      }
    });
  });
  
  // Refresh debug info
  refreshDebugBtn.addEventListener('click', () => {
    loadDebugInfo();
    showStatus('Debug info refreshed', 'info');
  });
  
  function showStatus(message, type) {
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;
    
    setTimeout(() => {
      statusDiv.className = '';
      statusDiv.textContent = '';
    }, 3000);
  }
  
  function loadData() {
    chrome.runtime.sendMessage({ action: 'getStats' }, (response) => {
      if (!response) return;
      
      loadHistory(response.history || []);
      loadStats(response.stats || {});
      loadDebugInfo();
    });
  }
  
  function loadDebugInfo() {
    chrome.storage.local.get(['timeTracking', 'visitHistory', 'userId'], async (result) => {
      const tracking = result.timeTracking || {};
      const history = result.visitHistory || [];
      const userId = result.userId;
      
      // Get current active tab
      let currentTab = 'Unknown';
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          currentTab = tab.url || 'chrome://...';
        }
      } catch (e) {
        currentTab = 'Unable to access';
      }
      
      // Calculate totals
      const totalDomains = Object.keys(tracking).length;
      const totalVisits = history.length;
      const totalTime = Object.values(tracking).reduce((sum, t) => sum + t.totalTime, 0);
      
      // Check if extension is working
      const isConfigured = !!userId;
      const hasData = totalVisits > 0 || totalDomains > 0;
      
      debugInfo.innerHTML = `
        <div class="debug-section">
          <div class="debug-title">⚙️ Configuration</div>
          <div class="debug-item">
            User ID: <span class="debug-value">${userId || 'Not set'}</span>
            <span class="debug-status ${isConfigured ? 'success' : 'error'}">
              ${isConfigured ? '✓ Configured' : '✗ Not configured'}
            </span>
          </div>
          <div class="debug-item">
            Current Tab: <span class="debug-value">${currentTab.substring(0, 50)}...</span>
          </div>
        </div>
        
        <div class="debug-section">
          <div class="debug-title">📊 Tracking Status</div>
          <div class="debug-item">
            Visit History: <span class="debug-value">${totalVisits} visits</span>
            <span class="debug-status ${totalVisits > 0 ? 'success' : 'warning'}">
              ${totalVisits > 0 ? '✓ Active' : '⚠ No data yet'}
            </span>
          </div>
          <div class="debug-item">
            Domains Tracked: <span class="debug-value">${totalDomains} domains</span>
          </div>
          <div class="debug-item">
            Total Time: <span class="debug-value">${formatDuration(totalTime)}</span>
          </div>
        </div>
        
        <div class="debug-section">
          <div class="debug-title">🔍 Recent Activity</div>
          ${history.length > 0 ? `
            <div class="debug-item">
              Last Visit: <span class="debug-value">${history[0].domain}</span>
            </div>
            <div class="debug-item">
              Duration: <span class="debug-value">${formatDuration(history[0].duration)}</span>
            </div>
            <div class="debug-item">
              When: <span class="debug-value">${formatTime(history[0].timestamp)}</span>
            </div>
          ` : '<div class="debug-item">No visits tracked yet</div>'}
        </div>
        
        <div class="debug-section">
          <div class="debug-title">💡 Tips</div>
          ${!isConfigured ? 
            '<div class="debug-item" style="color: #d32f2f;">⚠️ Set your User ID above to sync data</div>' : ''}
          ${!hasData ? 
            '<div class="debug-item" style="color: #f57c00;">⚠️ No data yet. Browse some sites then switch tabs.</div>' : ''}
          ${hasData ? 
            '<div class="debug-item" style="color: #388e3c;">✅ Extension is tracking! Keep browsing.</div>' : ''}
          <div class="debug-item">💡 Visit must be 3+ seconds to track</div>
          <div class="debug-item">💡 Data saves when you switch tabs</div>
          <div class="debug-item">💡 Auto-sync every 5 minutes</div>
        </div>
        
        <div class="debug-section">
          <div class="debug-title">🔧 Storage Details</div>
          <div class="debug-item">
            History Size: <span class="debug-value">${totalVisits}/100 max</span>
          </div>
          <div class="debug-item">
            Pending Sync: <span class="debug-value">${totalDomains} domains</span>
          </div>
        </div>
      `;
    });
  }
  
  function loadHistory(history) {
    if (!history || history.length === 0) {
      historyList.innerHTML = `
        <div class="empty-state">
          <div>📭</div>
          <p>No activity tracked yet</p>
          <p style="font-size: 12px; margin-top: 8px;">Start browsing to see your activity queue!</p>
        </div>
      `;
      return;
    }
    
    historyList.innerHTML = history
      .slice(0, 50) // Show last 50 visits
      .map(visit => {
        const duration = formatDuration(visit.duration);
        const time = formatTime(visit.timestamp);
        
        return `
          <div class="history-item">
            <div class="history-title" title="${visit.title}">${visit.title || visit.domain}</div>
            <div class="history-domain">${visit.domain}</div>
            <div class="history-meta">
              <span>${time}</span>
              <span class="history-duration">${duration}</span>
            </div>
          </div>
        `;
      })
      .join('');
  }
  
  function loadStats(stats) {
    const domains = Object.keys(stats);
    
    if (domains.length === 0) {
      statsList.innerHTML = `
        <div class="empty-state">
          <div>📭</div>
          <p>No data to display</p>
        </div>
      `;
      return;
    }
    
    // Sort by time spent
    domains.sort((a, b) => stats[b].totalTime - stats[a].totalTime);
    
    statsList.innerHTML = domains
      .slice(0, 10)
      .map(domain => {
        const data = stats[domain];
        const timeStr = formatDuration(data.totalTime);
        
        return `
          <div class="stat-item">
            <div class="stat-domain" title="${domain}">${domain}</div>
            <div class="stat-time">${timeStr}</div>
          </div>
        `;
      })
      .join('');
  }
  
  function formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  }
  
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
  
  // Refresh data every 5 seconds
  setInterval(loadData, 5000);
});
