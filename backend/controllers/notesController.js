const { createNote, getNotes, updateNote, deleteNote } = require("../models/note");

const create = async (req, res) => {
  const { title, content } = req.body;
  const user_id = req.user.id;
  try {
    const note = await createNote(user_id, title, content);
    res.status(201).json({ message: "Note created", note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  const user_id = req.user.id;
  try {
    const notes = await getNotes(user_id);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    await updateNote(id, user_id, title, content);
    res.json({ message: "Note updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    await deleteNote(id, user_id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { create, getAll, update, remove };
