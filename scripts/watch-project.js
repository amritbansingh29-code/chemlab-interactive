import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const srcDir = path.join(process.cwd(), 'src');
let isBuilding = false;
let buildPending = false;
let debounceTimeout = null;

function runBuild() {
  if (isBuilding) {
    buildPending = true;
    return;
  }

  isBuilding = true;
  buildPending = false;
  console.log('\n[Watcher] File change detected! Building and updating HTML files...');

  const start = Date.now();
  // Run Vite build and then execute post-build script
  exec('npx vite build && node scripts/build-project.js', (error, stdout, stderr) => {
    isBuilding = false;
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    
    if (error) {
      console.error(`[Watcher] Build failed in ${duration}s:`, error);
      if (stderr) console.error(stderr);
    } else {
      console.log(stdout.trim());
      console.log(`[Watcher] Build succeeded and HTML files updated in ${duration}s!`);
    }

    if (buildPending) {
      runBuild();
    }
  });
}

function onChange(eventType, filename) {
  if (filename) {
    // Ignore built files, node_modules, temp files, or hidden files
    if (
      filename.includes('node_modules') || 
      filename.includes('dist') || 
      filename.endsWith('.html') ||
      filename.startsWith('.')
    ) {
      return;
    }
    console.log(`[Watcher] File changed: src/${filename.replace(/\\/g, '/')}`);
  }

  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(runBuild, 300);
}

if (!fs.existsSync(srcDir)) {
  console.error(`Error: Source directory not found at ${srcDir}`);
  process.exit(1);
}

console.log(`[Watcher] Watching directory: ${srcDir}`);
console.log('[Watcher] Press Ctrl+C to stop the watcher.');

// Start watching src/ directory recursively
fs.watch(srcDir, { recursive: true }, onChange);

// Run an initial build on startup
runBuild();
