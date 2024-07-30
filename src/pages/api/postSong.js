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
  const instrument = body["instrument"];
  const status = body["status"];
  const access = body["access"];

  const query = `INSERT INTO songs2 VALUES (
  null,
  '${name.replaceAll("'", "\\'")}',
  '${artist.replaceAll("'", "\\'")}',
  '${slug.replaceAll("'", "")}',
  '${JSON.stringify(lines).replaceAll("'", "\\'")}',
  '${link}',
  ${capo ? parseInt(capo) : 0},
  '${key ?? ""}',
  '${tuning != "" ? tuning : "Standard"}',
  ${duration ? parseInt(duration) : 0},
  ${difficulty ? parseInt(difficulty) : 0},
  NOW(),
  NOW(),
  ${userId},
  0,
  '${JSON.stringify(tabs) ?? null}',
  '${instrument != "" ? instrument : "guitar"}',
  '${status != "" ? status : "draft"}',
  '${access != "" ? access : "public"}'
  )`;

  try {
    const result = await executeQuery({
      query: query,
    });

    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};
