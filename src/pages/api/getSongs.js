import executeQuery from "@/lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const userId = body["userId"];
  const saved = body["saved"];

  try {
    const result = await executeQuery({
      query: `SELECT *
      ${
        parseInt(saved) && saved.length > 0
          ? `, CASE WHEN id IN (${saved}) THEN true ELSE false END AS saved `
          : ""
      }
      FROM songs2
      WHERE (
        user_id = ${userId ?? 1}
        AND deleted = false
        ${!userId ? `AND access = "public"` : ""}
        ${!userId ? `AND status = "published"` : ""}
      )
      ${parseInt(saved) && saved.length > 0 ? `OR (id IN (${saved}))` : ""}`,
    });

    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
