const pst = new require("express").Router();
const posts = require("../database/post")
const {access} = require("../util")

// TODO  add middleware access 
// TODO need validation or other stuff, cause we don't trust client-side input

pst.post("/add", (req, res) => {

    pt = {
        title   : req.body.title,
        content : req.body.content,
        lang    : req.body.lang,
        cover   : req.body.cover ? req.body.cover : null
    }
    // there is no need to check the uniqueness of a new post by its title in db
    // in client-side > if(err.code == 23505 >>> unique_violation) and it won't 
    // insert that row in db cause we flaged it with uniqueness!
    posts.add(pt, (err, data) => res.json({err: err ? err : null, res: data ? "Inserted Successfully" : null}))
})


pst.post("/edit/:title", (req, res)=>{
	const title = req.params.title.split("-").join(" ")
    posts.get(title, (err, data) => {
        // check err.code in client-side to handle error properly
        if(err) res.json({err: err, res: null}) 
        // we found a match in our table
        // so we can edit it smoothly ;-)

        pt = {
            title   : req.body.title ? req.body.title : data.rows[0].title,
            content : req.body.content ? req.body.content : data.rows[0].content,
            lang    : req.body.lang ? req.body.lang : data.rows[0].lang,
            cover   : req.body.cover ? req.body.cover : data.rows[0].cover,
            modified: req.body.modified ? req.body.modified : data.rows[0].modified // comes from client-side with Date.now() or smt like that ...
        }

        posts.edit(data.rows[0].title, pt, (err, rslt) => {
            // check err.code in client-side to handle error properly
            res.json({err: err ? err : null, res: rslt ? "Edited Successfully" : null})
        })
    })
})

// data in the callback of posts.get api has a arr of objects ; 
// so we can access our fetched data by using like res[i] in client-side
// if there was no error!
pst.get("/:title", (req, res) => posts.get(req.params.title.split("-").join(" "), (err, data) => res.json({err: err ? err : null, res: data ? data.rows : null})))
pst.get("/", (req, res) => posts.getAll(req.query.page, req.query.limit, (err, data) => res.json({err: err ? err : null, res: data ? data.rows : null})))
pst.post("/delete/:title", (req, res) => posts.delete(req.params.title.split("-").join(" "), (err, data) => res.json({err: err ? err : null, res: data ? "Deleted Successfully" : null})))


module.exports = pst