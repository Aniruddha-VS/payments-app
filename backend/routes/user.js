const express = require("express");
const { z } = require("zod");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const bcrypt = require("bcrypt");

const signupSchema = z.object({
  username: z.string().email().min(3).max(30),
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  password: z.string().min(6),
});

const signinSchema = z.object({
  username: z.string().email().min(3).max(30),
  password: z.string().min(6),
});

const updateSchema = z.object({
  password: z.string().min(6).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
});

userRouter.post("/signup", async (req, res) => {
  const body = req.body;
  const success = signupSchema.safeParse(body).success;

  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const createdUser = await User.create({
    username: body.username,
    password: passwordHash,
    firstName: body.firstName,
    lastName: body.lastName,
  });

  const userId = createdUser._id;

  await Account.create({
    userId: userId,
    balanceInPaise: Math.floor(Math.random() * 100000) + 1,
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.cookie("sample-paytms-cookie", token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: true,
    secure: true,
  });

  res.status(200).json({
    ok: true,
    message: "User created successfully",
    passwordHash: passwordHash,
  });
});

userRouter.post("/signin", async (req, res) => {
  const body = req.body;
  const success = signinSchema.safeParse(req.body).success;

  if (!success) {
    res.status(411).json({
      message: "Error while logging in",
    });
  }

  const userFound = await User.findOne({
    username: body.username,
  });

  if (userFound) {
    if (await bcrypt.compare(body.password, userFound.password)) {
      const userId = userFound._id;

      const token = jwt.sign(
        {
          userId,
        },
        JWT_SECRET
      );

      res.cookie("sample-paytms-cookie", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        domain: "localhost",
        path: "/",
        secure: true,
        sameSite: "None",
      });
      return res.status(200).json({
        ok: true,
        message: "Successfully logged in.",
      });
    } else {
      return res.status(411).json({
        ok: false,
        message: "Incorrect Password",
      });
    }
  }

  res.status(411).json({
    ok: false,
    message: "Error while logging in",
  });
});

userRouter.post("/logout", authMiddleware, async (req, res) => {
  res.cookie("sample-paytms-cookie", "jibbrish", {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    domain: "localhost",
    path: "/",
    secure: true,
    sameSite: "None",
  });

  res.clearCookie("sample-paytms-cookie", {
    path: "/",
  });
  return res.status(200).redirect("/signin");
});

userRouter.get("/userdata", authMiddleware, async (req, res) => {
  try {
    let userData = await User.findById(req.userId).select("-password");
    const userAcc = await Account.findOne({
      userId: req.userId,
    }).select("balanceInPaise");

    const balance = userAcc.balanceInPaise / 100;

    const response = { ...userData.toObject(), balance: balance };

    res.json(response);
  } catch {
    res.status(403).json({ msg: "User not found" });
  }
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const body = req.body;

  const success = updateSchema.safeParse(body).success;

  if (!success) {
    return res.status(411).json({
      message: "Invalid inputs",
    });
  }
  try {
    await User.findByIdAndUpdate(req.userId, body);

    res.json({
      message: "Updated successfully",
    });
  } catch (err) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
});

userRouter.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";

  try {
    const filteredUsers = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    })
      .select("-password")
      .select("-__v");

    res.json({ users: filteredUsers });
  } catch (err) {
    console.log(err);
    res.status(411).json({
      message: "error getting users",
    });
  }
});

module.exports = { user: userRouter };
