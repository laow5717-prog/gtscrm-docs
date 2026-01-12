import type { Plugin } from 'vite';

/**
 * Stub plugin to replace viteArchiverPlugin from @vben/vite-config
 */
export function viteArchiverPlugin(options?: { outputDir?: string }): Plugin {
  return {
    name: 'vite-archiver-plugin-stub',
    // Empty implementation - does nothing
  };
}

/**
 * Stub plugin to replace viteVxeTableImportsPlugin from @vben/vite-config
 */
export function viteVxeTableImportsPlugin(): Plugin {
  return {
    name: 'vite-vxe-table-imports-plugin-stub',
    // Empty implementation - does nothing
  };
}
