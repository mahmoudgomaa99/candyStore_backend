const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const ProductSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    category: { type: String, require: true },
    rating: { type: Number },
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
    images: [{}],
    min_amount: { type: Number },
    max_amount: { type: Number },
    unit: { type: String, required: true }, //kg or gram or backet
    price_per_unit: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", ProductSchema);
