import "dotenv/config.js";
import { pool } from "../helper.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execMigrations = async () => {
  const client = await pool.connect();

  try {
    const filePath = path.join(__dirname, "01-init.sql");
    const script = fs.readFileSync(filePath, "utf8");

    console.log("Migrations executed successfully");
    await client.query(script);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
};

execMigrations();
