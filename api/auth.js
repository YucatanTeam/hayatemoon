const passport = require("passport")
const { access, authenticate } = require("../util.js");
const LocalStrategy = require("passport-local").Strategy;
const user = require("../database/user.js");

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    user.findById(id, (err, res) => {
        const user = res && res.rows && res.rows[0] ? res.rows[0] : false;
        if(user) delete user.password;
        done(err, user);
    });
});

passport.use('email-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, function(email, password, done) {
    user.findByEmail(email, (err, res) => {
        if (err) { return done(err); }
        const user = res.rows[0];
        if (!user) {
            return done(null, false); // incorrect email
        }
        compare(password, user.password, (err, same) => {
            if(err) {
                return done(err)
            } else if(!same) {
                return done(null, false); // incorrect password
            } else {
                delete user.password;
                return done(null, user);
            }
        });
    });
}));

// TODO implement email verification
// TODO implement sms verification
passport.use('email-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, function(email, password, done) {
    user.findByEmail(email, function (err, res) {
        const rows = res && res.rows;
        if (err)
            return done(err);
        if (rows.length) {
            return done(null, false);
        } else {
            // if there is no user with that email
            // create the user
            code(password, function(err, saltdk) {
                // saltdk contains the salt and hash (salt + hash) so we dont need to store salt
                // store saltdk in database
                user.addUser(email, saltdk, function (err, res) {
                    user.findByEmail(email, (err, res) => {
                        const user = res.rows[0];
                        delete user.password;
                        return done(null, user);
                    })
                })
            });
        }
    });
}));

const auth = new require("express").Router();

auth.all("/", (req, res) => {
    res.json({auth: "ok"})
})

auth.post('/login', authenticate('email-login'), (req, res) => {
    res.json(req.user)
});

auth.post('/register', authenticate('email-register'), (req, res) => {
    // TODO add verification step
    res.json(req.user)
});

auth.all('/logout', (req, res) => {
    req.logout();
    res.json({});
});

// users of an app
auth.get("/user", req => req.res.json(req.user));
auth.get("/users/:page/:limit", access(5), (req, res, next) => {
    user.getAll(req.params.limit, req.params.page, (err, ans) => {
        res.json(ans.rows.map(row => { delete row.password; return row; }))
    });
});

// TODO implement
// auth.delete("/user") body: {user:{id||email}}
// auth.post("/user/email") body: {user:{id||email}, email}
// auth.post("/user/access") body: {user:{id||email}, access}
// auth.post("/user/password") body: {user:{id||email}, password}

module.exports = auth;