module.exports = {
  // trailingSlash: true,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/api/:path*",
        destination: "https://blog.honeycombpizza.link/api/:path*",
        permanent: false,
      },
    ];
  },
};
