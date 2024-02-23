import excuteQuery from "@/lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const slug = body["slug"];

  console.log(slug, "slug");

  try {
    const result = await excuteQuery({
      query: `SELECT * FROM songs2 WHERE user_id = 1 AND slug = "${slug}"`,
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
