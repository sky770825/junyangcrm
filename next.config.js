/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude old Vite project files from compilation
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
  // Only compile files in app directory
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}

module.exports = nextConfig
