const { db } = require("../util")

module.exports = {
    add(adv, cb) {
        return db.query("INSERT INTO adv(title, content, cover, price, user_id) VALUES($1, $2, $3, $4, $5)", [adv.title, adv.content, adv.cover, adv.price, adv.user_id], cb)
    },
    getAll(page, limit, cb){
        return db.query("SELECT * FROM adv ORDER BY id LIMIT $1 OFFSET $2", [limit, (page - 1)*limit], cb)
    },
    get(title, cb){
        return db.query("SELECT * FROM adv WHERE title = $1", [title], cb)
    },
    edit(title, adv, cb){
        return db.query("UPDATE adv SET title = $2 , content = $3 , cover = $4, price = $5, modified = $6 WHERE title = $1 ", [title, adv.title, adv.content, adv.cover, adv.price, adv.modified], cb)
    },
    delete(title, cb){
        return db.query("DELETE FROM adv WHERE title = $1", [title], cb)
    }
}