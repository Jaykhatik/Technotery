import mongoose from "mongoose";

const categoryModel = new mongoose.Schema({
  name: String,
  description: String,
  qty: Number,
});

export const Category = mongoose.models.categories || mongoose.model("categories", categoryModel);
