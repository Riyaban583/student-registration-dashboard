const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const env = {
  ...process.env,
  NODE_ENV: 'production',
  BROWSERSLIST_IGNORE_OLD_DATA: '1',
};

function cleanNextDir() {
  const nextDir = path.join(process.cwd(), '.next');

  if (!fs.existsSync(nextDir)) {
    return;
  }

  if (process.platform === 'win32') {
    // On OneDrive-backed paths, Node/Next can fail on readlink during cleanup.
    // Using cmd's native recursive delete is more reliable here.
    const clean = spawnSync('cmd.exe', ['/d', '/s', '/c', 'rd /s /q .next'], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    if ((clean.status ?? 1) !== 0) {
      process.exit(clean.status ?? 1);
    }

    return;
  }

  fs.rmSync(nextDir, { recursive: true, force: true });
}

cleanNextDir();

const result =
  process.platform === 'win32'
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', 'next build'], {
        stdio: 'inherit',
        env,
      })
    : spawnSync('next', ['build'], {
        stdio: 'inherit',
        env,
      });

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
