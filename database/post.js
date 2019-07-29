const { db } = require("../util")

module.exports = {
    add(post, cb) {
        return db.query("INSERT INTO post(title, content, cover, lang) VALUES($1, $2, $3, $4)", [post.title, post.content, post.cover, post.lang], cb)
    },
    getAll(page, limit, cb){
        return db.query("SELECT * FROM post ORDER BY id LIMIT $1 OFFSET $2", [limit, (page - 1)*limit], cb)
    },
    get(title, cb){
        return db.query("SELECT * FROM post WHERE title = $1", [title], cb)
    },
    edit(title, post, cb){
        return db.query("UPDATE post SET title = $2 , content = $3 , cover = $4, lang = $5, modified = $6 WHERE title = $1 ", [title, post.title, post.content, post.cover, post.lang, post.modified], cb)
    },
    delete(title, cb){
        return db.query("DELETE FROM post WHERE title = $1", [title], cb)
    }
}