var express = require("express");
var db = require("../config/db");
var { ObjectId } = require("mongodb");

var orders = express.Router();

orders.post("/", async function (req, res) {
  try {
    const order = req.body;
    
    // Validate order data
    if (!order || !Array.isArray(order.lessons)) {
      return res.status(400).json({ error: "Invalid order format" });
    }

    // Start a session for transaction
    const session = db.client.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Insert the order
        await db.collection("orders").insertOne(order, { session });

        // Update lesson spaces
        for (const lesson of order.lessons) {
          const amount = lesson.amount;
          const id = new ObjectId(lesson.lesson._id);
          
          // Check if lesson exists and has enough spaces
          const lessonDoc = await db.collection("lessons").findOne(
            { _id: id, spaces: { $gte: amount } },
            { session }
          );

          if (!lessonDoc) {
            throw new Error(`Lesson ${id} not found or insufficient spaces`);
          }

          await db.collection("lessons").updateOne(
            { _id: id },
            { $inc: { spaces: -amount } },
            { session }
          );
        }
      });

      res.status(201).json({ message: "Order saved successfully" });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Order processing error:", error);
    res.status(500).json({ error: "Failed to process order" });
  }
});

module.exports = orders;
