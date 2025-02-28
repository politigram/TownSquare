import dbConnect from "../../../../lib/dbConnect";
import Discussion from "../../../../models/Discussion";

export default async function handler(req, res) {
  await dbConnect(); // ✅ Ensure database connection

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { discussionId } = req.query; // ✅ Ensure correct ID variable
  const { type } = req.body;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ error: "Discussion not found" });

    if (type === "like") discussion.likes += 1;
    if (type === "dislike") discussion.dislikes += 1;
    if (type === "flag") discussion.flags += 1;

    await discussion.save();
    return res.status(200).json(discussion);
  } catch (error) {
    console.error("Error updating vote:", error);
    return res.status(500).json({ error: "Failed to update discussion" });
  }
}
