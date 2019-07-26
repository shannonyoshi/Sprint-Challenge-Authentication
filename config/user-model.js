const db = require("../database/dbConfig");

module.exports = {
  add,

  findBy,
  findById
};

function findBy(filter) {
    return db("users").where(filter)
}

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(ids => {
      return findById(ids[0]);
    });
}

function findById(id) {
  return db("users")
    .where({ id })
    .first()
    .select("id", "username");
}
