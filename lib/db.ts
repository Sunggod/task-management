// Import only the MySQL client to avoid loading other dialects
import Knex from "knex"
const knex = Knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "task_management",
  },
  pool: { min: 0, max: 7 },
})

export const db = knex
