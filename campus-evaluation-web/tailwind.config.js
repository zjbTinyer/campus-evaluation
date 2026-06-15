/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // === 三主题系统 — 全部走 CSS 变量 ===
        paper:          'rgba(var(--c-paper), <alpha-value>)',
        ink:            'rgba(var(--c-ink), <alpha-value>)',
        'ink-light':    'rgba(var(--c-ink-light), <alpha-value>)',
        'ink-muted':    'rgba(var(--c-ink-muted), <alpha-value>)',
        primary:        'rgba(var(--c-primary), <alpha-value>)',
        'primary-hover':'rgba(var(--c-primary-hover), <alpha-value>)',
        'primary-light':'rgba(var(--c-primary-light), <alpha-value>)',
        seal:           'rgba(var(--c-seal), <alpha-value>)',
        sky:            'rgba(var(--c-sky), <alpha-value>)',
        gold:           'rgba(var(--c-gold), <alpha-value>)',
        'cat-eval':     'rgba(var(--c-cat-eval), <alpha-value>)',
        'cat-honor':    'rgba(var(--c-cat-honor), <alpha-value>)',
        'cat-task':     'rgba(var(--c-cat-task), <alpha-value>)',
        'cat-leave':    'rgba(var(--c-cat-leave), <alpha-value>)',
        'cat-activity': 'rgba(var(--c-cat-activity), <alpha-value>)',
        'cat-archive':  'rgba(var(--c-cat-archive), <alpha-value>)',
        surface:        'rgba(var(--c-surface), <alpha-value>)',
        divider:        'rgba(var(--c-divider), <alpha-value>)',
        'divider-strong':'rgba(var(--c-divider-strong), <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        number:  ['"DM Mono"', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'hero': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'btn':  'var(--radius-btn)',
        'pill': '9999px',
      },
      boxShadow: {
        'card':  '0 1px 2px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.03)',
        'float': '0 4px 20px rgba(0,0,0,0.06)',
        'glow':  '0 0 0 2px rgba(var(--c-primary), 0.12)',
      },
    },
  },
  plugins: [],
}
