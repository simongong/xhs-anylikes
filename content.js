// Mobile device dimensions
const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 812;

let statusBarElement = null;

// Create status bar element
function createStatusBar() {
  const statusBar = document.createElement('div');
  statusBar.id = 'mobile-status-bar';
  statusBar.innerHTML = `
    <div class="status-bar-content">
      <div class="time">${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
      <div class="right-items">
        <div class="signal">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
        <div class="wifi">
          <div class="dot"></div>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
        </div>
        <div class="battery">
          <div class="level"></div>
        </div>
      </div>
    </div>
  `;
  return statusBar;
}

// Function to modify styles
function modifyStyles(likesCount) {
  try {
    // remove `max-height` style from note-content
    const mediaContainer = document.querySelector('.media-container');
    if (mediaContainer) {
      mediaContainer.style.maxHeight = 'none';
    }

    // Hide close button (X button)
    const closeButton = document.querySelector('.close-box');
    if (closeButton) {
      closeButton.style.display = 'none';
    }

    // Hide share button
    const shareButton = document.querySelector('.share-wrapper');
    if (shareButton) {
      shareButton.style.display = 'none';
    }

    // Align user profile header to the right
    const userProfile = document.querySelector('.author-wrapper .info');
    if (userProfile) {
      userProfile.style.paddingLeft = 0;
    }

    const likesCountElement = document.querySelector('.buttons.engage-bar-style .left .count');
    if (likesCountElement) {
      likesCountElement.innerHTML = likesCount || '53';
    }

    statusBarElement = createStatusBar();
    document.body.insertBefore(statusBarElement, document.body.firstChild);

    const contentMask = document.querySelector('.note-detail-mask');
    if (contentMask) {
      contentMask.style.top = '44px';
    }

    const engagementBar = document.querySelector('.interactions.engage-bar');
    if (engagementBar) {
      engagementBar.style.padding = '12px 24px 32px 24px';
    }

    console.log('Styles modified successfully');
  } catch (error) {
    console.error('Error modifying styles:', error);
  }
}

// Function to take screenshot
function takeScreenshot() {
  // Wait a bit for the status bar to render
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: 'captureTab' }, (response) => {
      // Remove status bar after screenshot
      if (statusBarElement) {
        statusBarElement.remove();
        statusBarElement = null;
      }

      if (chrome.runtime.lastError) {
        console.error('Error taking screenshot:', chrome.runtime.lastError);
        return;
      }
      if (!response.success) {
        console.error('Screenshot failed:', response.error);
      }
    });
  }, 100);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request.action);
  
  try {
    switch (request.action) {
      case 'takeScreenshotWithStyle':
        modifyStyles(request.data?.likesCount);
        takeScreenshot();
        break;
    }
    // Send success response
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error in content script:', error);
    sendResponse({ success: false, error: error.message });
  }
  // Return true to keep the message channel open
  return true;
});