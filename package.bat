@echo off
REM Firefox Extension Packaging Script (Windows)
REM This script packages the extension into a .zip file ready for distribution

setlocal enabledelayedexpansion

REM Get the version from manifest.json
for /f "tokens=3 delims= " %%i in ('findstr /R /C:"\"version\":" manifest.json') do (
    set VERSION_LINE=%%i
    goto :got_version
)
:got_version
set VERSION=!VERSION_LINE:"=!
set VERSION=!VERSION:,=!

set BUILD_TIME=%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set BUILD_TIME=!BUILD_TIME: =0!
set EXTENSION_NAME=data-entry-tool

echo Packaging Firefox extension...
echo Version: !VERSION!
echo Build time: !BUILD_TIME!

REM Create a temporary directory for packaging
set TEMP_DIR=temp_package
if exist !TEMP_DIR! rmdir /s /q !TEMP_DIR!
mkdir !TEMP_DIR!

REM Copy all required files to the temporary directory
xcopy background.js !TEMP_DIR!\ /Y
xcopy content.js !TEMP_DIR!\ /Y
xcopy export.js !TEMP_DIR!\ /Y
xcopy manifest.json !TEMP_DIR!\ /Y
xcopy popup.html !TEMP_DIR!\ /Y
xcopy popup.js !TEMP_DIR!\ /Y
xcopy README.md !TEMP_DIR!\ /Y
xcopy PUSH_INSTRUCTIONS.md !TEMP_DIR!\ /Y
xcopy test.html !TEMP_DIR!\ /Y
xcopy /s icons !TEMP_DIR!\icons\

REM Create the package
set PACKAGE_NAME=!EXTENSION_NAME!-v!VERSION!-!BUILD_TIME!.zip
if exist "!PACKAGE_NAME!" del "!PACKAGE_NAME!"

REM Use PowerShell to create the zip archive
powershell -command "Compress-Archive -Path !TEMP_DIR!\* -DestinationPath '!PACKAGE_NAME!'"

REM Clean up temporary directory
rmdir /s /q !TEMP_DIR!

echo Package created: !PACKAGE_NAME!

REM Calculate checksum for verification
powershell -command "$hash = Get-FileHash -Path '!PACKAGE_NAME!' -Algorithm SHA256; $hash.Hash" > "!PACKAGE_NAME!.sha256"

set /p CHECKSUM=< "!PACKAGE_NAME!.sha256"
echo SHA256 Checksum: !CHECKSUM!

echo Packaging complete!
echo Done.