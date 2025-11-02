// export.js - Export functionality module
class DataExporter {
  constructor(data) {
    this.data = data;
  }
  
  // Export to CSV
  exportToCSV() {
    const headers = ['CompanyName', 'Website', 'LinkedIn', 'TeamMember1', 'TeamMember2'];
    let csvContent = headers.join(',') + '\n';
    
    // Filter out invalid rows (those without CompanyName)
    const validRows = this.data.filter(row => row.CompanyName && row.CompanyName.trim() !== '');
    
    // Process rows in batches for large datasets to avoid memory issues
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      const values = headers.map(header => {
        let value = row[header] || '';
        
        // Escape quotes in values
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
        }
        
        // Handle values containing commas or quotes by wrapping in quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value}"`;
        }
        
        return value;
      });
      csvContent += values.join(',') + '\n';
    }
    
    return csvContent;
  }
  
  // Export to JSON
  exportToJSON() {
    // Filter out invalid rows
    const validRows = this.data.filter(row => row.CompanyName && row.CompanyName.trim() !== '');
    return JSON.stringify(validRows, null, 2);
  }
  
  // Export to Google Sheets
  async exportToGoogleSheets() {
    // This would require OAuth implementation which is complex
    // For now, we show a message indicating it requires setup
    return new Promise((resolve, reject) => {
      // In a real implementation, this would:
      // 1. Check if user is authenticated
      // 2. Use Google Sheets API to create/upload the data
      // 3. Handle OAuth flow if needed
      showNotification('Google Sheets integration coming soon. Requires OAuth setup.', 'warning');
      reject(new Error('Google Sheets integration not yet implemented'));
    });
  }
  
  // Download file
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    URL.revokeObjectURL(url);
  }
}

// Usage in popup or options page
function exportData(format) {
  chrome.storage.local.get(['rowData'], (result) => {
    const data = result.rowData || [];
    
    // Count invalid rows that will be excluded
    const invalidCount = data.filter(row => !row.CompanyName || row.CompanyName.trim() === '').length;
    
    if (format === 'csv' || format === 'json') {
      const exporter = new DataExporter(data);
      
      if (format === 'csv') {
        try {
          const csvContent = exporter.exportToCSV();
          exporter.downloadFile(csvContent, 'exhibitor_data.csv', 'text/csv');
          if (invalidCount > 0) {
            showNotification(`Exported ${data.length - invalidCount} valid rows to CSV. ${invalidCount} rows excluded due to missing Company Name.`, 'success');
          } else {
            showNotification(`Exported ${data.length} rows to CSV successfully.`, 'success');
          }
        } catch (error) {
          console.error('Error exporting CSV:', error);
          showNotification('Error exporting to CSV. Please try again.', 'error');
        }
      } else if (format === 'json') {
        try {
          const jsonContent = exporter.exportToJSON();
          exporter.downloadFile(jsonContent, 'exhibitor_data.json', 'application/json');
          if (invalidCount > 0) {
            showNotification(`Exported ${data.length - invalidCount} valid rows to JSON. ${invalidCount} rows excluded due to missing Company Name.`, 'success');
          } else {
            showNotification(`Exported ${data.length} rows to JSON successfully.`, 'success');
          }
        } catch (error) {
          console.error('Error exporting JSON:', error);
          showNotification('Error exporting to JSON. Please try again.', 'error');
        }
      }
    } else if (format === 'googlesheets') {
      // For Google Sheets, we'll need to implement proper authentication
      // For now, we just show a notification
      showNotification('Google Sheets integration requires additional setup', 'warning');
    }
  });
}

// Global function to get export data for other modules
window.getExportData = function() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['rowData'], (result) => {
      resolve(result.rowData || []);
    });
  });
};