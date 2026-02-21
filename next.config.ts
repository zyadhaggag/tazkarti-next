import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
});

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: ["zmtotenlycanyejemaak.supabase.co", "ui-avatars.com"],
    },
};

module.exports = withPWA(nextConfig);
