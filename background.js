// background.js - Main process script
let currentRow = null;
let rowData = [];

// Initialize by loading stored data
chrome.runtime.onStartup.addListener(() => {
  initializeExtension();
});

chrome.runtime.onInstalled.addListener(() => {
  initializeExtension();
});

async function initializeExtension() {
  try {
    const result = await chrome.storage.local.get(['rowData', 'currentRow']);
    rowData = result.rowData || [];
    currentRow = result.currentRow || null;
  } catch (error) {
    console.error('Error initializing extension:', error);
    rowData = [];
    currentRow = null;
  }
}

// Keyboard shortcut listener
chrome.commands.onCommand.addListener((command) => {
  const columnMap = {
    'ctrl+shift+1': { id: 1, name: 'CompanyName', newRow: true },
    'ctrl+shift+2': { id: 2, name: 'Website', newRow: false },
    'ctrl+shift+3': { id: 3, name: 'LinkedIn', newRow: false },
    'ctrl+shift+4': { id: 4, name: 'TeamMember1', newRow: false },
    'ctrl+shift+5': { id: 5, name: 'TeamMember2', newRow: false },
    // Add Mac Command key equivalents
    'cmd+shift+1': { id: 1, name: 'CompanyName', newRow: true },
    'cmd+shift+2': { id: 2, name: 'Website', newRow: false },
    'cmd+shift+3': { id: 3, name: 'LinkedIn', newRow: false },
    'cmd+shift+4': { id: 4, name: 'TeamMember1', newRow: false },
    'cmd+shift+5': { id: 5, name: 'TeamMember2', newRow: false }
  };
  
  const column = columnMap[command];
  if (column) {
    // Get currently selected text
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'getSelection', 
        column: column,
        command: command  // Pass the command to identify the key combination used
      });
    });
  }
});

// Handle messages from popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveSelection') {
    const { text, column, command } = request;
    
    // Normalize data
    const normalizedText = normalizeData(text, column.name);
    
    // Handle edge case: Ctrl+2 pressed before Ctrl+1 (no active row)
    if (!column.newRow && !currentRow) {
      // Create a new row with empty CompanyName and flag it as a potential orphan field
      currentRow = { 
        id: Date.now(), 
        timestamp: new Date().toISOString(),
        invalid: true // Will be set to false once CompanyName is added
      };
      rowData.push(currentRow);
      
      // Show warning about orphan field
      showNotification(`Created new row for ${column.name} (no CompanyName set yet)`, 'warning');
    }
    
    // If new row or no active row, create new row
    if (column.newRow || !currentRow) {
      // If there's an existing unsaved row with required fields, validate it first
      if (currentRow && currentRow.CompanyName) {
        validateRow(currentRow);
      }
      
      currentRow = { 
        id: Date.now(), 
        timestamp: new Date().toISOString(),
        invalid: false
      };
      rowData.push(currentRow);
    }
    
    // Save data to current row
    currentRow[column.name] = normalizedText;
    
    // Validate row after update (especially important for CompanyName)
    if (column.name === 'CompanyName') {
      validateRow(currentRow);
    } else {
      // For other fields, re-validate to update invalid status
      validateRow(currentRow);
    }
    
    // Update storage
    saveData();
    
    // Show feedback
    const rowNumber = rowData.length;
    // Format the command for display (e.g., "ctrl+shift+1" becomes "Ctrl+Shift+1")
    const formattedCommand = command
      .split('+')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('+');
      
    showNotification(`${column.name} saved to row #${rowNumber} (by ${formattedCommand})`);
  } 
  // Handle reset current row request from popup
  else if (request.action === 'resetCurrentRow') {
    currentRow = null;
    saveData();
    showNotification('Current row has been reset. Ready to start from first row.', 'success');
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open for async response
});

// Save data to storage
async function saveData() {
  try {
    await chrome.storage.local.set({ 
      rowData: rowData, 
      currentRow: currentRow 
    });
  } catch (error) {
    console.error('Error saving data:', error);
    showNotification('Error saving data', 'error');
  }
}

// Validate a row
function validateRow(row) {
  // Check if required fields are filled
  if (!row.CompanyName || row.CompanyName.trim() === '') {
    row.invalid = true;
    return false;
  }
  
  // Check for duplicates
  const duplicateIndex = rowData.findIndex(
    (r, index) => index !== rowData.length - 1 && 
                  r.CompanyName === row.CompanyName &&
                  r.Website === row.Website
  );
  
  if (duplicateIndex !== -1) {
    row.duplicate = true;
    showNotification(`Warning: Duplicate entry detected for ${row.CompanyName}`, 'warning');
  } else {
    row.duplicate = false;
  }
  
  row.invalid = false;
  return true;
}

// Data normalization function
function normalizeData(text, columnType) {
  if (!text) return '';
  
  // Basic normalization
  let normalized = text.trim();
  
  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Remove surrounding punctuation
  normalized = normalized.replace(/^["'`\s,.;:!?]+|["'`\s,.;:!?]+$/g, '');
  
  // URL normalization
  if (columnType === 'Website' || columnType === 'LinkedIn') {
    if (normalized && !normalized.match(/^https?:\/\//i)) {
      normalized = 'https://' + normalized;
    }
  }
  
  // Name normalization
  if (columnType === 'CompanyName' || columnType.startsWith('TeamMember')) {
    normalized = toTitleCase(normalized);
  }
  
  return normalized;
}

// Title case conversion
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Show notification
function showNotification(message, type = 'success') {
  const options = {
    type: 'basic',
    // Using Firefox's default notification icon
    title: 'Data Entry Tool',
    message: message
  };
  
  // Set notification icon based on type
  if (type === 'error') {
    options.title = 'Data Entry Tool - Error';
  } else if (type === 'warning') {
    options.title = 'Data Entry Tool - Warning';
  }
  
  chrome.notifications.create(options);
}