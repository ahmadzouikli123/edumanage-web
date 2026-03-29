/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // قيم افتراضية للمتغيرات المطلوبة
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  },
  // إزالة أو تعديل الـ rewrites إذا كانت تسبب مشاكل
  async rewrites() {
    return [];
  },
  // إعدادات إضافية
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
