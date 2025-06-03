/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverActions: true,
    },
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
}

module.exports = nextConfig 