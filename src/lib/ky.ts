import ky from "ky";

export const client = ky.create({
  retry: {
    limit: 3,
    delay: () => 1000,
  },
});

export const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bright: '\x1b[1m'
};

export const PROGRESS_BAR_WIDTH = 40;

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function createProgressBar(percent: number): string {
  const filled = Math.floor((percent / 100) * PROGRESS_BAR_WIDTH);
  const empty = PROGRESS_BAR_WIDTH - filled;
  
  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);
  
  return `${colors.green}${filledBar}${colors.dim}${emptyBar}${colors.reset}`;
}

export function clearLine(): void {
  process.stdout.write('\r\x1b[K');
}