/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['raw.githubusercontent.com'],
    },
    exportPathMap: async function () {
        return {
            '/': { page: '/' },
        };
    },
};

module.exports = nextConfig;

