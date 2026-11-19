import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '*.config.*',
      'public/**',
      'akis/**',
      'yazilar/**',
      'raf/**',
      'videolar/**',
    ],
  },
  ...nextVitals,
]

export default eslintConfig
