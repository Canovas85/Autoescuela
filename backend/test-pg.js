import "dotenv/config";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();

  console.log("CONECTADO");

  const result = await client.query("SELECT current_database()");

  console.log(result.rows);

  await client.end();
} catch (error) {
  console.error(error);
}
