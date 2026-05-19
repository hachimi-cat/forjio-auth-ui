import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  bundle: false,
  splitting: false,
  treeshake: false,
  target: 'es2022',
  outDir: 'dist',
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  external: [
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react',
    'react-dom',
    'next',
    'next/link',
    'next/navigation',
    'lucide-react',
  ],
});
