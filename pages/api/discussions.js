import dbConnect from "../../lib/dbConnect";
import Discussion from "../../models/Discussion";
import User from "../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { sort, section } = req.query;
      let query = { section };

      let sortOption = { createdAt: -1 }; // Default: Most Recent
      if (section === "Town Hall") {
        sortOption = { engagementScore: -1 }; // ✅ Prioritize reliable posters
      }
      if (sort === "most_liked") sortOption = { likes: -1 };
      if (sort === "most_controversial") sortOption = { $expr: { $subtract: ["$likes", "$dislikes"] } };

      const discussions = await Discussion.find(query).sort(sortOption).populate("userId", "username karma");
      return res.status(200).json(discussions);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch discussions" });
    }
  }

  if (req.method === "POST") {
    const { body, section, userId } = req.body;
    if (!body || !section || !userId) return res.status(400).json({ error: "Missing required fields" });

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const newDiscussion = new Discussion({
        body,
        section,
        userId: user._id,
        engagementScore: section === "Town Hall" ? user.karma : 0 // ✅ Uses karma only in Town Hall
      });

      await newDiscussion.save();
      return res.status(201).json(newDiscussion);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create discussion" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
