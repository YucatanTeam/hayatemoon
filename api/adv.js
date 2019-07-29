const ad = new require("express").Router()
const adv = require("../database/adv")
const {access} = require("../util")

// TODO  add middleware access 
// TODO need validation or other stuff, cause we don't trust client-side input

ad.post("/add", (req, res) => {

    ad = {
        title   : req.body.title,
        user_id : req.body.user_id,
        content : req.body.content,
        price   : req.body.price,
        cover   : req.body.cover ? req.body.cover : null
    }
    // there is no need to check the uniqueness of a new adv by its title in db
    // in client-side > if(err.code == 23505 >>> unique_violation) and it won't 
    // insert that row in db cause we flaged it with uniqueness!
    adv.add(ad, (err, data) => res.json({err: err ? err : null, res: data ? "Inserted Successfully" : null}))
})


ad.post("/edit/:title", (req, res)=>{
	const title = req.params.title.split("-").join(" ")
    adv.get(title, (err, data) => {
        // check err.code in client-side to handle error properly
        if(err) res.json({err: err, res: null}) 
        // we found a match in our table
        // so we can edit it smoothly ;-)

        ad = {
            title   : req.body.title ? req.body.title : data.rows[0].title,
            content : req.body.content ? req.body.content : data.rows[0].content,
            cover   : req.body.cover ? req.body.cover : data.rows[0].cover,
            price   : req.body.price ? req.body.price : data.rows[0].price,
            modified: req.body.modified ? req.body.modified : data.rows[0].modified // comes from client-side with Date.now() or smt like that ...
        }

        adv.edit(data.rows[0].title, ad, (err, rslt) => {
            // check err.code in client-side to handle error properly
            res.json({err: err ? err : null, res: rslt ? "Edited Successfully" : null})
        })
    })
})

// data in the callback of posts.get api has a arr of objects ; 
// so we can access our fetched data by using like res[i] in client-side
// if there was no error!
ad.get("/:title", (req, res) => adv.get(req.params.title.split("-").join(" "), (err, data) => res.json({err: err ? err : null, res: data ? data.rows : null})))
ad.get("/", (req, res) => adv.getAll(req.query.page, req.query.limit, (err, data) => res.json({err: err ? err : null, res: data ? data.rows : null})))
ad.post("/delete/:title", (req, res) => adv.delete(req.params.title.split("-").join(" "), (err, data) => res.json({err: err ? err : null, res: data ? "Deleted Successfully" : null})))


module.exports = ad