/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['raw.githubusercontent.com'],
        unoptimized: true,
    },
    trailingSlash: true,
    output: 'export',
};

module.exports = nextConfig;

