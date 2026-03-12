import type { NextConfig } from "next";
import { getAllowedDevOrigins } from "./lib/mission-control-config";

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
};

export default nextConfig;
