import mysql from "mysql2/promise";

const connectionDetails = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
};

const db = mysql.createPool(connectionDetails);

export default async function executeQuery({ query, values }) {
  try {
    const connection = await db.getConnection();
    const results = await connection.query(query, values);
    connection.release();

    return results[0];
  } catch (error) {
    return { error };
  }
}
