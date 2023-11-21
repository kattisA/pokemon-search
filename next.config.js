/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['raw.githubusercontent.com'],
    },
    trailingSlash: true,
    output: 'export',
};

module.exports = nextConfig;

