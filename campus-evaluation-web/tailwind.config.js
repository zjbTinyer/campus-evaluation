/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // === 校园评价设计系统 ===
        paper:   '#F5F0E8',  // 纸白背景
        ink:     '#2D2420',  // 墨色正文
        'ink-light': '#8B7E74', // 淡墨辅助
        vermilion: '#D4644A',  // 朱砂红 (强调/操作)
        calm:    '#4A6FA5',  // 静蓝 (链接/任务)
        moss:    '#5B8C5A',  // 苔绿 (完成/评语)
        gold:    '#C9A84C',  // 金色 (荣誉)
        orchid:  '#8E6CAB',  // 兰紫 (请假)
        surface: '#FFFFFF',  // 卡片白
        divider: '#E8E0D5',  // 分割线
      },
      fontFamily: {
        display: ['"Noto Serif SC"', 'serif'],
        body:    ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        number:  ['"DM Mono"', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'hero': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'card': '0.75rem',
        'btn': '0.625rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        'float': '0 4px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
