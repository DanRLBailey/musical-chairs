import executeQuery from "@/lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const slug = body["slug"];

  try {
    const result = await executeQuery({
      query: `SELECT * FROM songs2 WHERE user_id = 1 AND slug = "${slug}"`,
    });

    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
