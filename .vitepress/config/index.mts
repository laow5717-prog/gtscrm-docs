import { withPwa } from '@vite-pwa/vitepress';
import { defineConfigWithTheme } from 'vitepress';
import { execSync } from 'node:child_process';

import { en } from './en.mts';
import { shared } from './shared.mts';
import { zh } from './zh.mts';

// Check if git is available and has commits to avoid build errors
function isGitAvailable(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    // Check if there are any commits
    const commitCount = execSync('git rev-list --count HEAD 2>/dev/null || echo "0"', {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();
    return parseInt(commitCount, 10) > 0;
  } catch {
    return false;
  }
}

const config = defineConfigWithTheme({
  ...shared,
  locales: {
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      ...en,
    },
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      ...zh,
    },
  },
});

// Only apply PWA if git is available, otherwise use config directly
export default isGitAvailable() ? withPwa(config) : config;
