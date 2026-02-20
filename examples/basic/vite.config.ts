import { resolve } from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';

export default defineConfig(async () => {
  const viteConfigFn = (await import('./vite.config.mjs')).default;
  const viteConfig = viteConfigFn({ mode: 'test', command: 'serve' });

  return mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        pool: 'vmThreads',
        reporters: ['default', ['html', { outputFile: resolve(process.cwd(), 'build/unit-test-report/index.html') }]],
        name: 'unit-tests',
        include: ['**/*.spec.ts'],
        globals: true,
        environment: `jsdom`,
        setupFiles: [
          './src/test/vitest.setup.ts',
          './src/test/failTestOnConsoleError.ts',
          './src/test/failOnMissingBuild.ts',
        ],
        coverage: {
          provider: 'v8',
          include: ['**/*.{ts,vue}'],
          exclude: ['**/*.{d.ts,stories.ts}', 'test/**/*.ts'],
          reportsDirectory: resolve(process.cwd(), 'build/coverage'),
          reporter: [
            'text',
            // for coverage results aggregated for GitLab MR view
            'cobertura',
            'html',
            // lcov for sonar-scanner
            `lcov`,
          ],
          thresholds: {
            functions: 89,
            lines: 96,
            branches: 82,
          },
        },
      },
    }),
  );
});
