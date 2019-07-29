const api = new require("express").Router();
const auth = require("./api/auth");
const post = require("./api/post")
// ...

api.use("/auth", auth);
api.use("/post", post);

// ...

api.use("/", req => req.res.json({api: "ok"}))

module.exports = api;