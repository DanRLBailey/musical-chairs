import executeQuery from "@/lib/db";

export default async (req, res) => {
  const body = JSON.parse(req.body);

  const userId = 1;
  const name = body["name"];
  const artist = body["artist"];
  const slug = body["slug"];
  const lines = body["lines"];
  const link = body["link"];
  const capo = body["capo"];
  const key = body["key"];
  const tuning = body["tuning"];
  const duration = body["duration"];
  const difficulty = body["difficulty"];
  const tabs = body["tabs"];

  const query = `UPDATE songs2 SET
  name = '${name}',
  artist = '${artist}',
  \`lines\` = '${JSON.stringify(lines).replaceAll("'", "\\'")}',
  link = '${link}',
  capo = ${capo ? parseInt(capo) : 0},
  \`key\` = '${key}',
  tuning = '${tuning}',
  duration = ${duration ? parseInt(duration) : 0},
  difficulty = ${difficulty ? parseInt(difficulty) : 0},
  last_updated = NOW(),
  tabs = '${JSON.stringify(tabs)}'
  WHERE slug = '${slug}'
  `;

  try {
    const result = await executeQuery({
      query: query,
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
