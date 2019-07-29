require('dotenv').config()
const pg = require('pg')
const db = pg.Pool();
db.connect();

const passport = require("passport");

const access = (level, redirect = false) => (req, res, next) => {
    if(!req.user) {
        return refirect ? 
        res.status(401).redirect(redirect)
        : res.status(401).send("401: Unauthorized !");
    }
    if(req.user.access < level) {
        return refirect ? 
        res.status(403).redirect(redirect)
        : res.status(403).send("403: Forbidden !");
    }
}

const authenticate = strategy => req => passport.authenticate(strategy)(req, req.res, req.next);

const crypto = require('crypto');

function code(password, cb) {
    const salt = crypto.randomBytes(16).hexSlice()
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, dk) => cb(err, salt + dk.toString()))
}

function compare(password, saltdk, cb) {
    const salt = saltdk.slice(0, 32);
    const dk = saltdk.slice(32);
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, sdk) => cb(err, sdk.toString() === dk))
}

module.exports = { access, code, compare, authenticate, db }