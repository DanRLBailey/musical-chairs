import executeQuery from "@/lib/db";

export default async (req, res) => {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  const body = JSON.parse(req.body);
  const email = body["email"];
  const password = body["password"];

  const hashedPass = await bcrypt.hash(password, saltRounds);

  try {
    const users = await executeQuery({
      query: `SELECT * FROM users2
      WHERE email = "${email}"`,
    });

    await bcrypt.compare(
      password,
      users[0]["password"],
      async function (err, result) {
        if (result) {
          const user = users[0];
          const result = await executeQuery({
            query: `UPDATE users2
            SET last_login = NOW()
            WHERE id = ${user.id} AND email = "${user.email}"`,
          });

          console.log(result);

          res.send({ res: result, user: user });
        }
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
};
