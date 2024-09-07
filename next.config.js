/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PRISMA_IGNORE_DB_ERRORS: "true",
  },
}

module.exports = nextConfig
