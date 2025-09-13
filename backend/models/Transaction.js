// In models/Transaction.js
import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true }, // <-- ADD THIS LINE
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, default: 'Other' }, // Consider adding a default
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);