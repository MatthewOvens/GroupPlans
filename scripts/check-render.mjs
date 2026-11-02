import { build } from 'vite';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

await build({
  build: {
    ssr: 'tests/render.tsx',
    outDir: '.qa/render',
    emptyOutDir: false,
    rollupOptions: { output: { entryFileNames: 'render.mjs' } },
  },
});
await import(pathToFileURL(resolve('.qa/render/render.mjs')).href);
