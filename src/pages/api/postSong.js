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

  const query = `INSERT INTO songs2 VALUES (
  null,
  '${name.replaceAll("'", "'")}',
  '${artist.replaceAll("'", "'")}',
  '${slug.replaceAll("'", "")}',
  '${JSON.stringify(lines).replaceAll("'", "\\'")}',
  '${link}',
  ${capo ? parseInt(capo) : 0},
  '${key}',
  '${tuning}',
  ${duration ? parseInt(duration) : 0},
  ${difficulty ? parseInt(difficulty) : 0},
  NOW(),
  NOW(),
  1,
  0,
  '${JSON.stringify(tabs)}'
  )`;

  //TODO: Update "1" to the user id

  //TODO: First check if slug exists, then add a "version" modifier if so
  //  In case of duplicate songs

  try {
    const result = await executeQuery({
      query: query,
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
