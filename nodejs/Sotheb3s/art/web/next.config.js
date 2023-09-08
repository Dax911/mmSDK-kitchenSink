/** @type {import('next').NextConfig} */
const nextConfig = { 
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'beta.dax.so',
            port: '',
            pathname: '/images/**',
          },
        ],
      },
}

module.exports = nextConfig
