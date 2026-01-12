import type { PwaOptions } from '@vite-pwa/vitepress';
import type { HeadConfig } from 'vitepress';

import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

import {
  viteArchiverPlugin,
  viteVxeTableImportsPlugin,
} from '../plugins/stub-vite-config';

import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite';
import tailwind from 'tailwindcss';
import type { Plugin } from 'vite';
import { defineConfig, postcssIsolateStyles } from 'vitepress';
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons';

import { demoPreviewPlugin } from './plugins/demo-preview';
import { search as zhSearch } from './zh.mts';

// Check if git is available and has commits
function hasGitCommits(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    const commitCount = execSync('git rev-list --count HEAD 2>/dev/null || echo "0"', {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();
    return parseInt(commitCount, 10) > 0;
  } catch {
    return false;
  }
}

// Create a stub virtual module for git changelog when there are no commits
function createGitChangelogStubPlugin(): Plugin {
  return {
    name: 'git-changelog-stub',
    resolveId(id) {
      if (id === 'virtual:nolebase-git-changelog') {
        return id;
      }
    },
    load(id) {
      if (id === 'virtual:nolebase-git-changelog') {
        // Return empty data structure that the plugin expects
        return `export default {
          changelogs: [],
          contributors: [],
        };`;
      }
    },
  };
}

export const shared = defineConfig({
  appearance: false, // 默认使用白天模式，禁用暗色模式切换
  head: head(),
  markdown: {
    preConfig(md) {
      md.use(demoPreviewPlugin);
      md.use(groupIconMdPlugin);
    },
  },
  pwa: pwa(),
  srcDir: 'src',
  themeConfig: {
    i18nRouting: true,
    logo: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
    search: {
      options: {
        locales: {
          ...zhSearch,
        },
      },
      provider: 'local',
    },
    siteTitle: 'GtChat',
    socialLinks: [],
  },
  title: 'GtChat 系统产品说明书',
  vite: {
    build: {
      chunkSizeWarningLimit: Infinity,
      minify: 'terser',
    },
    css: {
      postcss: {
        plugins: [
          tailwind(),
          postcssIsolateStyles({ includeFiles: [/vp-doc\.css/] }),
        ],
      },
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    json: {
      stringify: true,
    },
    plugins: [
      ...(hasGitCommits()
        ? [
            GitChangelog({
              mapAuthors: [
                {
                  mapByNameAliases: ['Vben'],
                  name: 'vben',
                  username: 'anncwb',
                },
                {
                  name: 'vince',
                  username: 'vince292007',
                },
                {
                  name: 'Li Kui',
                  username: 'likui628',
                },
              ],
              repoURL: () => 'https://github.com/vbenjs/vue-vben-admin',
            }),
            GitChangelogMarkdownSection(),
          ]
        : [createGitChangelogStubPlugin()]),
      viteArchiverPlugin({ outputDir: '.vitepress' }),
      groupIconVitePlugin(),
      await viteVxeTableImportsPlugin(),
    ],
    server: {
      fs: {
        allow: ['../..'],
      },
      host: true,
      port: 6173,
    },

    ssr: {
      external: ['@vue/repl'],
      noExternal: ['@nolebase/vitepress-plugin-git-changelog'],
    },
  },
});

function head(): HeadConfig[] {
  return [
    ['meta', { content: 'GtChat', name: 'author' }],
    [
      'meta',
      {
        content: 'GtChat, 产品说明书, 系统文档',
        name: 'keywords',
      },
    ],
    ['link', { href: '/favicon.ico', rel: 'icon', type: 'image/svg+xml' }],
    [
      'meta',
      {
        content:
          'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
        name: 'viewport',
      },
    ],
    ['meta', { content: 'GtChat 系统产品说明书', name: 'keywords' }],
    ['link', { href: '/favicon.ico', rel: 'icon' }],
    // [
    //   'script',
    //   {
    //     src: 'https://cdn.tailwindcss.com',
    //   },
    // ],
  ];
}

function pwa(): PwaOptions {
  return {
    includeManifestIcons: false,
    manifest: {
      description:
        'GtChat 系统产品说明书',
      icons: [
        {
          sizes: '192x192',
          src: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-192.png',
          type: 'image/png',
        },
        {
          sizes: '512x512',
          src: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-512.png',
          type: 'image/png',
        },
      ],
      id: '/',
      name: 'GtChat 系统产品说明书',
      short_name: 'gtchat_doc',
      theme_color: '#ffffff',
    },
    outDir: resolve(process.cwd(), '.vitepress/dist'),
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
  };
}
