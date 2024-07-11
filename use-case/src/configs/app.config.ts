import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  version: process.env.APP_VERSION,
  title: process.env.APP_TITLE || "",
  desc: process.env.APP_DESC || "",
  port: process.env.APP_PORT || "3000",
  baseURL: process.env.APP_BASE_URL || "http://localhost:3000",
}));
