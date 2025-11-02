// content.js - Content script
// Listen for messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelection') {
    const selection = window.getSelection().toString();
    if (selection) {
      chrome.runtime.sendMessage({
        action: 'saveSelection',
        text: selection,
        column: request.column
      });
    } else {
      showOverlay('No text selected. Please select text and try again.', 'warning');
    }
  }
});

// Show overlay message
function showOverlay(message, type = 'success') {
  // Create or update overlay element
  let overlay = document.getElementById('data-entry-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'data-entry-overlay';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '20px';
    overlay.style.right = '20px';
    overlay.style.maxWidth = '400px';
    overlay.style.backgroundColor = type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 
                                  type === 'warning' ? 'rgba(255, 152, 0, 0.9)' : 
                                  'rgba(76, 175, 80, 0.9)';
    overlay.style.color = 'white';
    overlay.style.padding = '15px';
    overlay.style.borderRadius = '5px';
    overlay.style.zIndex = '10000';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.fontSize = '14px';
    overlay.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    document.body.appendChild(overlay);
  }
  
  overlay.textContent = message;
  overlay.style.display = 'block';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 3000);
}