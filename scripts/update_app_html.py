from pathlib import Path

path = Path('app.html')
text = path.read_text(encoding='utf-8')

replacements = [
    (
        '--glass-bg:#121420b3;--glass-border:#ffffff14;--glass-blur:blur(12px);--glass-shadow:0 8px 32px 0 #0000005e;',
        '--glass-bg:rgba(10,14,26,.68);--glass-border:rgba(148,163,184,.18);--glass-blur:blur(18px);--glass-shadow:0 18px 45px rgba(15,23,42,.45);',
    ),
    (
        '.hero-panel-item,.hero-panel-card,.highlight-card{background:#ffffff0a;border:1px solid #ffffff14;border-radius:18px;padding:1.25rem;box-shadow:0 12px 30px #00000029}',
        '.hero-panel-item,.hero-panel-card,.highlight-card{background:linear-gradient(145deg,rgba(15,23,42,.82),rgba(15,23,42,.56));border:1px solid var(--glass-border);border-radius:18px;padding:1.25rem;box-shadow:var(--glass-shadow);-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur)}',
    ),
    (
        '.glass-card{background:var(--glass-bg);-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);box-shadow:var(--glass-shadow);border-radius:16px}',
        '.glass-card{background:linear-gradient(145deg,rgba(15,23,42,.82),rgba(9,14,26,.68));-webkit-backdrop-filter:var(--glass-blur);backdrop-filter:var(--glass-blur);border:1px solid var(--glass-border);box-shadow:var(--glass-shadow);border-radius:16px}',
    ),
    (
        '.app-header{-webkit-backdrop-filter:blur(16px);z-index:100;border-radius:20px;flex-wrap:nowrap;justify-content:space-between;align-items:center;gap:1.5rem;margin:1.25rem 0 2rem;padding:.8rem 1.8rem;display:flex;box-shadow:0 10px 30px #0006;background:#0a0b10a6!important;border:1px solid #ffffff14!important}',
        '.app-header{-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);z-index:100;border-radius:20px;flex-wrap:nowrap;justify-content:space-between;align-items:center;gap:1.5rem;margin:1.25rem 0 2rem;padding:.8rem 1.8rem;display:flex;box-shadow:0 18px 45px rgba(15,23,42,.45);background:linear-gradient(135deg,rgba(10,14,26,.82),rgba(15,23,42,.72))!important;border:1px solid rgba(148,163,184,.18)!important}',
    ),
]

count = 0
for old, new in replacements:
    if old in text:
        text = text.replace(old, new)
        count += 1

path.write_text(text, encoding='utf-8')
print(f'REPLACEMENTS={count}')
