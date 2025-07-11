/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',    // 手机横屏
      'md': '768px',    // 平板
      'lg': '1024px',   // 小型桌面
      'xl': '1280px',   // 大型桌面
      '2xl': '1536px',  // 超大屏幕
    },
    extend: {
      colors: {
        primary: '#165DFF',
        secondary: '#6B7280',
        success: '#36D399',
        warning: '#FBBD23',
        danger: '#F87272',
        info: '#3ABFF8',
        light: '#F3F4F6',
        dark: '#1F2937',
        'gray-100': '#F9FAFB',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.safe-area-inset': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        },
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top)'
        },
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom)'
        },
        '.pl-safe': {
          paddingLeft: 'env(safe-area-inset-left)'
        },
        '.pr-safe': {
          paddingRight: 'env(safe-area-inset-right)'
        },
        '.h-screen-safe': {
          height: 'calc(100vh - env(safe-area-inset-bottom))'
        }
      }
      // 移除底部安全区域相关的样式
      const filteredUtilities = {};
      for (const key in newUtilities) {
        if (key !== '.pb-safe' && key !== '.h-screen-safe') {
          filteredUtilities[key] = newUtilities[key];
        }
      }
      addUtilities(filteredUtilities)
    },
  ],
}