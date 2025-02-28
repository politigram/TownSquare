import { dbConnect } from "../../../../../../lib/dbConnect";
import Discussion from "../../../../../../models/Discussion";

export default async function handler(req, res) {
  await dbConnect();
  
  const { discussionId, commentId } = req.query;

  if (req.method === "POST") {
    const { author, content } = req.body;

    try {
      const discussion = await Discussion.findById(discussionId);
      if (!discussion) return res.status(404).json({ message: "Discussion not found" });

      const comment = discussion.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });

      const newReply = {
        author,
        content,
        createdAt: new Date(),
        likes: 0,
        dislikes: 0,
        flags: 0,
        replies: []
      };

      comment.replies.push(newReply);
      await discussion.save();

      return res.status(201).json(discussion);
    } catch (error) {
      return res.status(500).json({ message: "Error adding reply", error });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
