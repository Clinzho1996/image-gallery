import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    img: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//If the Post collection does not exist create a new one.
export default mongoose.models.Post || mongoose.model("Post", postSchema);
