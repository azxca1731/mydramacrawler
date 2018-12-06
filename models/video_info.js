import { Schema, model } from "mongoose";

const videoInfoSchema = new Schema({
  index: Number,
  title: String,
  episode: Number,
  broadcastdate: Number,
  quality: Number,
  magnet: String
});
export default model("videoInfo", videoInfoSchema);
