import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  name: process.env.DATABASE_NAME || "",
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT || "3306",
  user: process.env.DATABASE_USER || "root",
  pass: process.env.DATABASE_PASS || "",
}));
