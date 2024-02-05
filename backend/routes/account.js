const express = require("express");
const mongoose = require("mongoose");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const { z } = require("zod");

const router = express.Router();

const transferSchema = z.object({
  to: z.string(),
  amount: z.number().nonnegative().finite().safe(),
});

router.get("/balance", authMiddleware, async (req, res) => {
  const sender = await Account.findOne({
    userId: req.userId,
  }).select("balanceInPaise");

  res.json({
    balance: sender.balanceInPaise / 100,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const body = req.body;
  const success = transferSchema.safeParse(req.body).success;
  const senderId = req.userId;
  const amountInPaise = body.amount * 100;
  console.log("Payment Initiated");

  if (!success) {
    res.status(411).json({
      message: "invalid inputs",
    });
  }

  // check if user has balence
  const sender = await Account.findOne({
    userId: senderId,
  }).select("balanceInPaise");

  console.log(
    `Curr balance: ${sender.balanceInPaise}, req transfer: ${amountInPaise}`
  );

  if (sender.balanceInPaise < amountInPaise) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const session = await mongoose.startSession();

  //start session
  try {
    session.startTransaction();

    // deduct from sender
    await Account.findOneAndUpdate(
      {
        userId: senderId,
      },
      {
        $inc: { balanceInPaise: -amountInPaise },
      },
      { session }
    );

    // increase to reciever
    await Account.findOneAndUpdate(
      {
        userId: body.to,
      },
      {
        $inc: { balanceInPaise: amountInPaise },
      },
      { session }
    );

    await session.commitTransaction();
    console.log("Payment done");

    res.json({
      message: "Transfer successful",
    });

    return;
  } catch (err) {
    await session.abortTransaction();

    res.status(411).json({
      message: "Transaction failed",
    });
  }

  session.endSession();
});

module.exports = {
  account: router,
};
