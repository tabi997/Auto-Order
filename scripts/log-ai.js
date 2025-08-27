#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const changelogPath = path.join(process.cwd(), 'docs', 'AI_CHANGELOG.md');

function appendToChangelog(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const entry = `\n## ${timestamp} - ${message}\n\n`;
  
  try {
    if (fs.existsSync(changelogPath)) {
      fs.appendFileSync(changelogPath, entry);
      console.log('✅ Added entry to AI_CHANGELOG.md');
    } else {
      console.error('❌ AI_CHANGELOG.md not found at:', changelogPath);
    }
  } catch (error) {
    console.error('❌ Error writing to changelog:', error.message);
  }
}

// Get message from command line arguments
const message = process.argv.slice(2).join(' ');

if (!message) {
  console.error('❌ Please provide a message: pnpm log:ai "your message here"');
  process.exit(1);
}

appendToChangelog(message);
