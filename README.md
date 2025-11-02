# Data Entry Tool Firefox Extension

> **Transform your data collection workflow with lightning-fast keyboard shortcuts!**

<div align="center">
  <p>A keyboard shortcut-based browser extension to streamline data entry from web pages into structured CSV/JSON formats.</p>
  
  [![Firefox Add-on](https://img.shields.io/badge/Firefox-Extension-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![Version](https://img.shields.io/badge/Version-1.0-blue.svg?style=for-the-badge)](#)
  [![CI/CD](https://github.com/Soumya-Chakraborty/Data-retriver/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/Soumya-Chakraborty/Data-retriver/actions)
  
  <img src="https://placehold.co/800x400/2563eb/white?text=Data+Entry+Tool+Preview" alt="Extension Preview" />
</div>

---

## Features

### Keyboard Shortcuts 
- `Ctrl+1`: **Create new row** and set Company Name
- `Ctrl+2`: Set Website for current row
- `Ctrl+3`: Set LinkedIn for current row
- `Ctrl+4`: Set Team Member 1 for current row
- `Ctrl+5`: Set Team Member 2 for current row

### Data Normalization
- Automatically trims whitespace and removes surrounding punctuation
- Adds `https://` prefix to URLs if missing
- Converts names to title case for consistency

### Validation
- Checks for required fields (Company Name)
- Detects and flags duplicate entries
- Highlights invalid rows for review

### Export Options
- Export to **CSV** with proper formatting
- Export to **JSON** for API integration
- Export to **Google Sheets** (coming soon)

### Advanced Data Management
- **Pagination** for large datasets (up to 400+ rows)
- Real-time statistics tracking
- **Reset** and **Start from First** functionality
- Duplicate detection and warnings

---

## Installation

### Quick Setup
1. Open Firefox browser
2. Navigate to `about:debugging`
3. Click on **"This Firefox"** on the left sidebar
4. Click **"Load Temporary Add-on"**
5. Select the `manifest.json` file from the extension directory
6. The extension is now ready to use!

---

## Development & Build

### Prerequisites
- Node.js (v14 or higher)
- Git

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Soumya-Chakraborty/Data-retriver.git
   cd Data-retriver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Build Process
1. Build the extension package:
   ```bash
   npm run build
   # or
   ./package.sh
   ```
   
   This will create a ZIP file of the extension ready for distribution.

2. For Windows systems:
   ```cmd
   package.bat
   ```

### CI/CD Pipeline
This project uses GitHub Actions for continuous integration and deployment:

- **Testing**: Validates manifest.json and checks JavaScript syntax
- **Building**: Creates a packaged extension file (.zip)
- **Releasing**: Publishes to Firefox Add-ons when a GitHub release is created

To create a new release:
```bash
npm run release
```

---

## Usage Guide

### Basic Workflow
1. **Navigate** to a webpage with exhibitor information
2. **Select** text for the company name
3. Press `Ctrl+1` to create a new row and set Company Name
4. **Select** text for the website
5. Press `Ctrl+2` to set Website field in the same row
6. Continue with other fields using `Ctrl+3` to `Ctrl+5`
7. Click extension icon to **view collected data**
8. Use export buttons to save your data as CSV or JSON

### Advanced Workflow
- Each `Ctrl+1` press creates a **new row context**
- Subsequent fields are added to the **same row** until next `Ctrl+1`
- Use **pagination** to navigate large datasets
- **Reset** all data with one button when needed
- **Start from First** to begin a fresh collection session

### Test Workflow
1. Visit a sample exhibitor page
2. Select company name and press `Ctrl+1`
3. Select website and press `Ctrl+2`
4. Continue with other fields
5. View and export collected data

---

## File Structure

```
avrpix/
├── manifest.json          # Extension configuration
├── background.js          # Core functionality & data management
├── content.js             # Page interaction & selection capture
├── popup.html             # User interface for viewing/exporting data
├── popup.js               # Popup interface logic
├── export.js              # Export functionality
├── icons/                 # Extension icons directory
│   └── README.md          # Icon guidelines
├── .github/               # GitHub Actions workflows
│   └── workflows/         # CI/CD pipeline configuration
├── scripts/               # Build and packaging scripts
│   ├── package.sh         # Linux/Mac packaging script
│   └── package.bat        # Windows packaging script
├── releases/              # Release configuration
│   └── release.config.js  # Release tool configuration
├── CHANGELOG.md           # Release history
├── package.json           # Build scripts and dependencies
├── README.md              # This documentation
├── PUSH_INSTRUCTIONS.md   # Git workflow instructions
└── test.html              # Sample test page
```

---

## Security & Privacy

### Data Security
- **All data is stored locally** in your browser
- No data transmitted to external servers (except during export)
- Google Sheets integration requires OAuth (not yet implemented)

### Privacy First
- Zero tracking or analytics
- No data collection from users
- Local storage only - your data never leaves your machine

---

## Troubleshooting

### Common Issues
| Issue | Solution |
|-------|----------|
| Shortcuts not working | Verify extension has required permissions |
| Data not saving | Reload extension from `about:debugging` |
| Console errors | Check browser console for detailed messages |
| Missing icons | Add required PNG files to `icons/` directory |

---

## Pro Tips

- **Pro Tip 1**: Use `Ctrl+1` to create a new row context before adding related fields
- **Pro Tip 2**: Use the **Start from First** button to reset your current row and begin a new collection session
- **Pro Tip 3**: Check pagination when working with large datasets (400+ rows)
- **Pro Tip 4**: Export frequently to prevent data loss

---

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test your changes in Firefox
5. Commit your changes: `git commit -m 'Add some amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a pull request

---

## Release Process

1. Update the version in `manifest.json`
2. Run: `npm run release` to create a new release
3. This will update the changelog and create a new Git tag
4. Push the changes: `git push origin main --follow-tags`
5. Create a GitHub release from the tag

---

<div align="center">
  <h3> Made with ❤️ for efficient data collection </h3>
  <p>Happy data hunting!</p>
</div>