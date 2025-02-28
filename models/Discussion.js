import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema({
  body: { type: String, required: true },
  section: { type: String, enum: ["Town Hall", "The Pub"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  flags: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Ensure the model isn't recompiled multiple times
export default mongoose.models.Discussion || mongoose.model("Discussion", DiscussionSchema);
