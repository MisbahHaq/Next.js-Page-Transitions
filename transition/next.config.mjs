// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

module.exports = {
    redirects: async () => [
        {
            source: '/old-route',
            destination: '/new-route',
            permanent: true,
        },
    ],
};
