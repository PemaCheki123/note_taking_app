const db = require("./db");
const bcrypt = require("bcrypt");

const createUser = async (name, email, password) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

module.exports = { createUser, findUserByEmail };
