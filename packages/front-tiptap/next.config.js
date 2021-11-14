/** @type {import('next').NextConfig} */
const withImages = require("next-images");

exports = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = withImages(exports);
