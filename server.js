const bodyParser = require('body-parser');
const helmet = require('helmet');
const vhost = require('vhost');
const path = require('path');
const cookieSession = require('cookie-session');
const passport = require('passport');
const express = require('express');
require('dotenv').config()
const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieSession({
    name: process.env.SECRET,
    keys: [
        process.env.COOKIE_SECRET
    ],
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}))

require(`./api/auth.js`); // init passport
app.use(passport.initialize());
app.use(passport.session());

app.use(vhost(`api.${process.env.HOST}`, require("./api.js")))
app.use(vhost(`www.${process.env.HOST}`, express.static(path.join(__dirname, './ui/public/'))))
app.use(vhost(`${process.env.HOST}`, express.static(path.join(__dirname, './ui/public/'))))

if(process.env.PORT == "managed") {
    app.listen()
} else {
    app.listen(process.env.PORT);
    console.log(`server is up at http://${process.env.HOST}:${process.env.PORT}`)
}
    
    