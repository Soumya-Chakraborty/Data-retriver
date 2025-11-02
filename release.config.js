// Release Configuration for Data Entry Tool Firefox Extension
// Used by standard-version or similar release tools

module.exports = {
  // Package settings
  packageFiles: ['manifest.json'],
  bumpFiles: ['manifest.json'],
  
  // Version management
  header: `# Changelog\n\nAll notable changes to this project will be documented in this file.\n`,
  
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'feature', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'perf', section: 'Performance Improvements' },
    { type: 'revert', section: 'Reverts' },
    { type: 'docs', section: 'Documentation' },
    { type: 'style', section: 'Styles' },
    { type: 'chore', section: 'Miscellaneous Chores' },
    { type: 'refactor', section: 'Code Refactoring' },
    { type: 'test', section: 'Tests' },
    { type: 'build', section: 'Build System' },
    { type: 'ci', section: 'Continuous Integration' }
  ],
  
  // Release settings
  releaseCommitMessageFormat: 'chore(release): v${version}',
  tagPrefix: 'v',
  
  // Asset settings
  assets: [
    'manifest.json',
    'background.js',
    'content.js',
    'export.js',
    'popup.html',
    'popup.js',
    'README.md',
    'PUSH_INSTRUCTIONS.md',
    'test.html',
    'icons/**',
    '!.github/**',
    '!node_modules/**'
  ],
  
  // GitHub Release settings
  github: {
    release: true,
    assets: ['*.zip'],
    releasedLabels: ['Status: Released']
  },
  
  // Scripts to run before/after release
  scripts: {
    prerelease: 'npm run test',
    postbump: 'npm run build',
    postrelease: 'echo "Release complete! Check GitHub for the new release."'
  }
};