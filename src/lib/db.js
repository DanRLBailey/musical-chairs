import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "guitar-tabs-db.cddrlf2md3st.eu-west-2.rds.amazonaws.com",
  user: "admin",
  password: "HpX8xazoy8GPkGqv2DLd",
  database: "guitar-tabs",
});

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
