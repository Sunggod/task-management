// Import only the MySQL client to avoid loading other dialects
import Knex from "knex"
const knex = Knex({
  client: "mysql2",
  connection: {
    host: '127.0.0.1',
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "senacrs",
    database: process.env.DB_NAME || "task_management",
  },
  pool: { min: 0, max: 7 },
})

export const db = knex
