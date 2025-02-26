// Helper function to get the current active tab
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Helper function to check if URL matches xiaohongshu.com
function isXiaohongshuUrl(url) {
  return url.match(/xiaohongshu\.com/);
}

// Helper function to send message to content script
async function sendMessageToContentScript(action, data = {}) {
  try {
    const tab = await getCurrentTab();
    
    if (!tab || !isXiaohongshuUrl(tab.url)) {
      alert('Please open this extension on xiaohongshu.com');
      return;
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action, data });
    
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      alert('Please refresh the page and try again');
      return;
    }

    if (!response || !response.success) {
      console.error('Action failed:', response?.error || 'Unknown error');
      alert('Operation failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Please refresh the page and try again');
  }
}

// Add click event listener for the combined action
document.getElementById('takeScreenshot').addEventListener('click', () => {
  const likesCount = document.getElementById('likesCount').value;
  sendMessageToContentScript('takeScreenshotWithStyle', { likesCount });
});