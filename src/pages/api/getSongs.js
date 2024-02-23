import executeQuery from "@/lib/db";

export default async (req, res) => {
  try {
    const result = await executeQuery({
      query: `SELECT * FROM songs2 WHERE user_id = 1 AND deleted = false`,
    });

    res.send(result);
  } catch (error) {
    res.error(error);
  }
};
