/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/home',
          permanent: true, // or false if you want a temporary redirect
        },
      ];
    },
  };
  
  export default nextConfig;