import executeQuery from "@/lib/db";

export default async (req, res) => {
  const instruments = ["guitar", "keyboard", "bass"];

  let query = ``;
  instruments.forEach((instrument, index) => {
    if (index > 0) query += "UNION ALL\n";

    query += `(
      SELECT * FROM songs2
      WHERE (
          status = 'published'
          AND access = 'public'
          AND deleted = false
          AND instrument = '${instrument}'
      )
      LIMIT 20
    )\n`;
  });

  try {
    const result = await executeQuery({
      query: query,
    });

    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
