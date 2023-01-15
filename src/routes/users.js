const express = require("express");
const router = express.Router();

const users = require("../models/users");

// read user
router.get("/", async (req, res) => {
  const usersList = await users.find();
  if (usersList.length !== 0) {
    res.json(usersList);
  } else {
    res.status(404).send("database is empty");
  }
});

router.get("/:id", getUser, async (req, res) => {
  if (req.user === null || req.user.length === 0) {
    res.status(404).send(`user with id: ${req.params.id} was not found`);
  } else {
    res.json(req.user);
  }
});

// create user
router.post("/", async (req, res) => {
  const user = new users({
    name: req.body.name,
    user: req.body.user,
    age: parseInt(req.body.age),
    email: req.body.email,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// update user
router.put("/:id", getUser, async (req, res) => {
  const user = req.user[0];
  if (user === null) {
    res.status(404).send(`could not find user with id: ${req.params.id}`);
  } else {
    user.name = req.body.name;
    user.age = req.body.age;
    user.email = req.body.email;
    user.user = req.body.user;

    const updatedUser = await user.save();
    res.json({ updated: true, data: updatedUser });
  }
});

// router.put("/:id", getUser, async (req, res) => {
//   const id = req.params.id;
//   if (req.user === null) {
//     res.status(404).send(`could not find user: ${id}`);
//   } else {
//     req.user.name = req.body.name;
//     req.user.age = req.body.age;
//     req.user.email = req.body.email;
//     req.user.user = req.body.user;
//     const updatedUser = await req.user.save();
//     res.json({"updated": true, })
//   }
// })

// delete user
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await users.deleteOne({ user: id });
    res.json({ delted: true });
  } catch (error) {
    res.status(500).send("could not delete user");
  }
});

router.all("*", (req, res) => {
  res.status(404).send("could not find the requested resource");
});

async function getUser(req, res, next) {
  const id = req.params.id;
  try {
    const user = await users.find({ user: id });
    console.log(user);
    req.user = user;
  } catch (error) {
    res.status(400).json({ error: error.message });
    req.user = undefined;
  }
  next();
}

module.exports = router;
