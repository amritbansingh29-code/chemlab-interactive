import fs from 'fs';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist', 'index.html');
const appHtmlPath = path.join(process.cwd(), 'app.html');
const chemistryProjectPath = path.join(process.cwd(), 'CHEMISTRY PROJECT.html');

const replacements = [
  [
    '--glass-bg:#121420b3;--glass-border:#ffffff14;--glass-blur:blur(12px);--glass-shadow:0 8px 32px 0 #0000005e;',
    '--glass-bg:rgba(10,14,26,.68);--glass-border:rgba(148,163,184,.18);--glass-blur:blur(18px);--glass-shadow:0 18px 45px rgba(15,23,42,.45);'
  ],
  [
    '.hero-panel-item,.hero-panel-card,.highlight-card{background:#ffffff0a;border:1px solid #ffffff14;border-radius:18px;padding:1.25rem;box-shadow:0 12px 30px #00000029}',
    '.hero-panel-item,.hero-panel-card,.highlight-card{background:linear-gradient(145deg,rgba(15,23,42,.82),rgba(15,23,42,.56));border:1px solid var(--glass-border);border-radius:18px;padding:1.25rem;box-shadow:var(--glass-shadow);-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur)}'
  ],
  [
    '.glass-card{background:var(--glass-bg);-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);box-shadow:var(--glass-shadow);border-radius:16px}',
    '.glass-card{background:linear-gradient(145deg,rgba(15,23,42,.82),rgba(9,14,26,.68));-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);box-shadow:var(--glass-shadow);border-radius:16px}'
  ],
  [
    '.app-header{-webkit-backdrop-filter:blur(16px);z-index:100;border-radius:20px;flex-wrap:nowrap;justify-content:space-between;align-items:center;gap:1.5rem;margin:1.25rem 0 2rem;padding:.8rem 1.8rem;display:flex;box-shadow:0 10px 30px #0006;background:#0a0b10a6!important;border:1px solid #ffffff14!important}',
    '.app-header{-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);z-index:100;border-radius:20px;flex-wrap:nowrap;justify-content:space-between;align-items:center;gap:1.5rem;margin:1.25rem 0 2rem;padding:.8rem 1.8rem;display:flex;box-shadow:0 18px 45px rgba(15,23,42,.45);background:linear-gradient(135deg,rgba(10,14,26,.82),rgba(15,23,42,.72))!important;border:1px solid rgba(148,163,184,.18)!important}'
  ]
];

function runPostBuild() {
  try {
    if (!fs.existsSync(distPath)) {
      console.error(`Error: Built file not found at ${distPath}. Run "npm run build" first.`);
      process.exit(1);
    }

    let content = fs.readFileSync(distPath, 'utf8');
    let replacementCount = 0;

    for (const [oldStr, newStr] of replacements) {
      if (content.includes(oldStr)) {
        content = content.replaceAll(oldStr, newStr);
        replacementCount++;
      } else {
        // Also support potential minification / whitespace variation just in case
        const oldStrClean = oldStr.replace(/\s+/g, '');
        if (content.includes(oldStrClean)) {
          content = content.replaceAll(oldStrClean, newStr);
          replacementCount++;
        }
      }
    }

    console.log(`[Post-build] Applied ${replacementCount}/${replacements.length} style replacements.`);

    // Write to app.html
    fs.writeFileSync(appHtmlPath, content, 'utf8');
    console.log(`[Post-build] Updated app.html successfully.`);

    // Write to CHEMISTRY PROJECT.html
    fs.writeFileSync(chemistryProjectPath, content, 'utf8');
    console.log(`[Post-build] Updated CHEMISTRY PROJECT.html successfully.`);

    // Copy downloaded videos to dist for live web deployment
    const videosSource = path.join(process.cwd(), 'downloaded videos');
    const videosDest = path.join(process.cwd(), 'dist', 'downloaded videos');
    if (fs.existsSync(videosSource)) {
      fs.cpSync(videosSource, videosDest, { recursive: true });
      console.log('[Post-build] Copied downloaded videos to dist.');
    }

    console.log('[Post-build] Build files sync complete!');
  } catch (error) {
    console.error('Post-build script failed:', error);
    process.exit(1);
  }
}

runPostBuild();
