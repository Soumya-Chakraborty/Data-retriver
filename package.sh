#!/bin/bash

# Firefox Extension Packaging Script
# This script packages the extension into a .zip file ready for distribution

set -e  # Exit immediately if a command exits with a non-zero status

# Get the version from manifest.json
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)
BUILD_TIME=$(date +%Y%m%d-%H%M%S)
EXTENSION_NAME="data-entry-tool"

echo "Packaging Firefox extension..."
echo "Version: $VERSION"
echo "Build time: $BUILD_TIME"

# Create a temporary directory for packaging
TEMP_DIR="temp_package"
mkdir -p "$TEMP_DIR"

# Copy all required files to the temporary directory
cp -r background.js content.js export.js manifest.json popup.html popup.js README.md PUSH_INSTRUCTIONS.md test.html icons "$TEMP_DIR/"

# Create the package
PACKAGE_NAME="${EXTENSION_NAME}-v${VERSION}-${BUILD_TIME}.zip"
cd "$TEMP_DIR"
zip -r "../$PACKAGE_NAME" . -x "icons/README.md"
cd ..

# Clean up temporary directory
rm -rf "$TEMP_DIR"

echo "Package created: $PACKAGE_NAME"
echo "Package size: $(ls -lh "$PACKAGE_NAME" | awk '{print $5}')"

# Calculate checksum for verification
CHECKSUM=$(sha256sum "$PACKAGE_NAME" | cut -d' ' -f1)
echo "SHA256 Checksum: $CHECKSUM"

# Save checksum to file
echo "$CHECKSUM" > "${PACKAGE_NAME}.sha256"

echo "Packaging complete!"
echo "Files included in package:"
unzip -l "$PACKAGE_NAME" | head -20
echo "... (truncated)"