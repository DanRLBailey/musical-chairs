import executeQuery from "@/lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const userId = body["userId"];
  const slugs = body["slugs"];

  try {
    const query = `SELECT * FROM songs2 WHERE user_id = ${userId} AND slug IN (${slugs.join(
      ", "
    )})`;

    const result = await executeQuery({
      query: query,
    });

    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
