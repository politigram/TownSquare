import { dbConnect } from "../../../../lib/dbConnect";
import Discussion from "../../../../models/Discussion";

export default async function handler(req, res) {
  await dbConnect();

  const { discussionId } = req.query;
  const { entityType, commentId, replyId } = req.body; // entityType = 'post', 'comment', 'reply'

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    if (entityType === "post") {
      discussion.flags += 1;  // ✅ Increment flags for the post
    } else if (entityType === "comment" && commentId) {
      const comment = discussion.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });

      comment.flags += 1;  // ✅ Increment flags for the comment
    } else if (entityType === "reply" && commentId && replyId) {
      const comment = discussion.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });

      const reply = comment.replies.id(replyId);
      if (!reply) return res.status(404).json({ message: "Reply not found" });

      reply.flags += 1;  // ✅ Increment flags for the reply
    } else {
      return res.status(400).json({ message: "Invalid entityType or missing IDs" });
    }

    await discussion.save();
    return res.status(200).json({ message: "Flag added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error flagging content", error });
  }
}
