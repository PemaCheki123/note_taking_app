const db = require("./db");

const createNote = (user_id, title, content) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
      [user_id, title, content],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

const getNotes = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM notes WHERE user_id = ?", [user_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const updateNote = (id, user_id, title, content) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
      [title, content, id, user_id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

const deleteNote = (id, user_id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM notes WHERE id = ? AND user_id = ?", [id, user_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    }); 
  });
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
