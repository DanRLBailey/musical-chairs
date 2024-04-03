import executeQuery from "@/lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const email = body["email"];

  try {
    const existingUser = await executeQuery({
      query: `SELECT * FROM users2 WHERE email = "${email}"`,
    });

    if (!existingUser || existingUser.length <= 0)
      res
        .status(404)
        .send({ userExists: false, message: "User does not exist" });

    console.log(existingUser);

    res.status(200).send({ userExists: true, user: existingUser[0] });
  } catch (error) {
    res.status(400).send(error);
  }
};
