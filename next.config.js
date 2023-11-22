/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['raw.githubusercontent.com'],
        unoptimized: true,
    },
    trailingSlash: true,
    output: 'export',
    basePath: '/pokemon-search',
};

module.exports = nextConfig;

