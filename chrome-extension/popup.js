// Popup Script for TimeLoop Chrome Extension

document.addEventListener('DOMContentLoaded', async () => {
  const userIdInput = document.getElementById('userId');
  const saveBtn = document.getElementById('saveBtn');
  const syncBtn = document.getElementById('syncBtn');
  const statusDiv = document.getElementById('status');
  const statsList = document.getElementById('statsList');
  
  // Load saved user ID
  const { userId } = await chrome.storage.local.get('userId');
  if (userId) {
    userIdInput.value = userId;
  }
  
  // Load and display stats
  loadStats();
  
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
        setTimeout(loadStats, 1000);
      } else {
        showStatus('Failed to sync data', 'error');
      }
    });
  });
  
  function showStatus(message, type) {
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;
    
    setTimeout(() => {
      statusDiv.className = '';
      statusDiv.textContent = '';
    }, 3000);
  }
  
  function loadStats() {
    chrome.runtime.sendMessage({ action: 'getStats' }, (response) => {
      if (!response || !response.stats) {
        statsList.innerHTML = `
          <div class="empty-state">
            <div>📭</div>
            <p>No activity tracked yet</p>
          </div>
        `;
        return;
      }
      
      const stats = response.stats;
      const domains = Object.keys(stats);
      
      if (domains.length === 0) {
        statsList.innerHTML = `
          <div class="empty-state">
            <div>📭</div>
            <p>No activity tracked yet</p>
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
          const minutes = Math.floor(data.totalTime / 60);
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          
          let timeStr;
          if (hours > 0) {
            timeStr = `${hours}h ${mins}m`;
          } else if (minutes > 0) {
            timeStr = `${minutes}m`;
          } else {
            timeStr = `${data.totalTime}s`;
          }
          
          return `
            <div class="stat-item">
              <div class="stat-domain" title="${domain}">${domain}</div>
              <div class="stat-time">${timeStr}</div>
            </div>
          `;
        })
        .join('');
    });
  }
  
  // Refresh stats every 10 seconds
  setInterval(loadStats, 10000);
});
