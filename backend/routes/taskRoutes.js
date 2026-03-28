const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const newTask = new Task({
    title: req.body.title
  });

  const savedTask = await newTask.save();
  res.json(savedTask);
});

router.put("/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true }
  );

  res.json(updatedTask);
});

router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

router.post("/", async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save task" });
  }
});

module.exports = router;