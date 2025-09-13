import express from "express";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add transaction
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body; // <-- Add description here

    const transaction = new Transaction({
      user: req.user,
      description, // <-- And here
      amount,
      type,
      category,
      date
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all transactions of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update transaction
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete transaction
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
    res.json({ msg: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;