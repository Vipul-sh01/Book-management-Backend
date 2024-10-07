import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  summary: {
    type: String
  },
  bookImage: {
    type: String,
},
}, { timestamps: true });

export const Books = mongoose.model("Books", bookSchema);
