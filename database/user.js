const { db } = require("../util.js");

module.exports = {
    findById(id, cb) {
        return db.query("SELECT * FROM users WHERE id = $1", [id], cb);
    },
    findByEmail(email, cb) {
        return db.query("SELECT * FROM users WHERE email = $1", [email], cb);
    },
    addUser(email, password, cb) {
        return db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password], cb);
    },
    getAll(page, limit, cb) {
        return db.query("SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2", [limit, (page - 1)*limit], cb);
    },
}