import executeQuery from "@/lib/db";

export default async (req, res) => {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  const body = JSON.parse(req.body);
  const email = body["email"];
  const password = body["password"];
  const displayName = body["displayName"];
  const username = body["username"];

  const hashedPass = await bcrypt.hash(password, saltRounds);

  try {
    const newUser = await executeQuery({
      query: `INSERT INTO users2 VALUES(
        NULL,
        NOW(),
        "${email}",
        "${hashedPass}",
        NULL,
        "user",
        "${displayName}",
        "${username}",
        []
      )`,
    });

    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};
