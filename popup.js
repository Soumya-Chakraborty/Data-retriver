// popup.js - Popup window script
let currentPage = 1;
const rowsPerPage = 15; // Increased from 10 to show more rows per page
let allData = [];

document.addEventListener('DOMContentLoaded', function() {
  // Load data
  loadData();
  
  // Bind export button events
  document.getElementById('exportCSV').addEventListener('click', () => exportData('csv'));
  document.getElementById('exportJSON').addEventListener('click', () => exportData('json'));
  document.getElementById('exportSheets').addEventListener('click', () => exportData('googlesheets'));
  
  // Bind pagination events
  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });
  
  document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });
  
  // Bind reset and start from first events
  document.getElementById('resetData').addEventListener('click', resetAllData);
  document.getElementById('startFromFirst').addEventListener('click', startFromFirst);
});

function loadData() {
  chrome.storage.local.get(['rowData'], (result) => {
    allData = result.rowData || [];
    document.getElementById('rowCount').textContent = allData.length;
    
    // Calculate invalid and duplicate counts
    const invalidCount = allData.filter(row => row.invalid).length;
    const duplicateCount = allData.filter(row => row.duplicate).length;
    
    document.getElementById('invalidCount').textContent = invalidCount;
    document.getElementById('duplicateCount').textContent = duplicateCount;
    
    // Reset to first page
    currentPage = 1;
    
    // Render the table
    renderTable();
  });
}

function renderTable() {
  const tableBody = document.getElementById('dataTableBody');
  tableBody.innerHTML = '';
  
  // Calculate pagination
  const totalPages = allData.length === 0 ? 1 : Math.ceil(allData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, allData.length);
  
  // Update pagination controls
  document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
  
  // Get current page data
  const currentPageData = allData.slice(startIndex, endIndex);
  
  currentPageData.forEach(row => {
    const tr = document.createElement('tr');
    if (row.invalid) {
      tr.classList.add('invalid-row');
    }
    if (row.duplicate) {
      tr.classList.add('duplicate-row');
    }
    
    tr.innerHTML = `
      <td title="${row.CompanyName || 'Not set'}">${truncateText(row.CompanyName || '', 25)}</td>
      <td title="${row.Website || 'Not set'}">${truncateText(row.Website || '', 15)}</td>
      <td title="${row.LinkedIn || 'Not set'}">${truncateText(row.LinkedIn || '', 15)}</td>
      <td title="${row.TeamMember1 || 'Not set'}">${truncateText(row.TeamMember1 || '', 15)}</td>
    `;
    
    tableBody.appendChild(tr);
  });
}

// Helper function to truncate text with ellipsis
function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Reset all data
function resetAllData() {
  if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
    chrome.storage.local.set({ rowData: [] }, () => {
      allData = [];
      currentPage = 1;
      loadData();
      showNotification('All data has been reset', 'success');
    });
  }
}

// Start from first (reset current row in background)
function startFromFirst() {
  // Send message to background to reset current row
  chrome.runtime.sendMessage({ action: 'resetCurrentRow' }, (response) => {
    showNotification('Ready to start from first row', 'success');
  });
}

// Show notification function compatible with popup
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Make showNotification globally available for export.js
window.showNotification = showNotification;