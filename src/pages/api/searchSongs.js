import executeQuery from "@/lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const query = body["query"];

  console.log("queryyyyy", query);

  try {
    const result = await executeQuery({
      query: `SELECT * FROM songs2
      WHERE (
        status = "published"
        AND access = "public"
        AND deleted = false
        AND (name LIKE '%${query}%' OR artist LIKE '%${query}%')
      )`,
    });

    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
