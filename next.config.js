/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder_key_123456789',
    NEXT_PUBLIC_API_URL: 'https://placeholder.com',
    NEXTAUTH_URL: 'https://edumanage-web.vercel.app',
    NEXTAUTH_SECRET: 'placeholder_secret_123',
  },
}
module.exports = nextConfig
