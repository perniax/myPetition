const express = require("express");
const hb = require("express-handlebars");
// const fs = require("fs");
const db = require("./utils/db");
// const support = require("./supporters");
let cookieSession = require("cookie-session");
const bc = require("./utils/bc");
let { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const app = express();
// const redis = require("./redis");
// const profileRouter = require("./profle-routes");
// const { requireNoSignature, requireSignature } = require("./middleware");
// const { requireNoRegistration, requireRegistration } = require("./middleware");
//we add the function in the app.get, after the route, and now there is no need to add !req.session...
// E.G
// app.get("/petition", requireNoSignature, (req, res) => {
//     res.render("petition");
// });
//*****

//****
app.use(
    cookieSession({
        secret: `Hakuna_Matata`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.locals.helpers = {};

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    // console.log("The route is: ", req.url);
    next();
});

//***profile Router
// app.use(profileRouter);

app.get("/", (req, res) => {
    res.redirect("/registration");
});

app.get("/registration", (req, res) => {
    res.render("registration", {
        name: "registration",
        layout: "main"
    });
});

app.post("/registration", (req, res) => {
    console.log("body in reg form: ", req.body);
    console.log(req.body.email);
    if (req.body.password == "") {
        res.render("registration", {
            error: "error",
            layout: "main"
        });
    } else {
        hash(req.body.password)
            .then(hashedPass => {
                console.log("hashedPass: ", hashedPass);
                db.addUser(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashedPass
                )
                    .then(result => {
                        ///store the cookie, that comes from result
                        console.log("result from addUser: ", result);
                        req.session.userId = result[0].id;
                        console.log("return from addUser row/userId: ", result);
                        // res.redirect("/petition");
                        res.redirect("/profile");
                    })
                    .catch(e =>
                        console.log("error with the registration: ", e)
                    );
            })
            .catch(e => console.log("error in hashedPass", e));
    }
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        name: "profile",
        layout: "main"
    });
});

//**PENDING TO HANDLE URLs (set http://...)
app.post("/profile", (req, res) => {
    console.log("body from profile: ", req.body);
    console.log("cookie from registration: ", req.session.userId);
    let url;
    if (
        !req.body.url.startsWith("http://") ||
        !req.body.url.startsWith("https://")
    ) {
        url = "http://" + req.body.url;
    }
    if (url == "https://" || url == "http://") {
        url = null;
    }
    //req.session.user_id is not body, here we are calling for the cookie that is already stored
    db.addProfile(req.body.age, req.body.city, url, req.session.userId)
        .then(result => {
            console.log("result from addProfile", result);
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("error on profile: ", err);
        });
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        name: "petitionHome",
        layout: "main"
    });
});

app.post("/petition", (req, res) => {
    // console.log(req.body.first);
    console.log(req.body);
    // we pass here the signature from /petition, adn the cookie with the userID that comes from addUser;
    //**needs a user_id from the petition table!!
    db.addSignature(req.body.sig, req.session.userId)
        .then(resultId => {
            console.log("resultID from addSignature: ", resultId);
            //**UserID cookie already stored in /registration, now we set:
            req.session.cookieId = resultId.rows[0].id;
            // console.log("cookie from addSignature: ", resultId.rows[0].id);
            // console.log("response OBJECT for the addSuporter db: ", resultId);
            // console.log("row/id for this input: ", resultId.rows[0].id);
            //resultID returns the ROW but is set to be RETURNING id, to asign to the cookie,
            res.redirect("/thankyou");
        })
        .catch(err => {
            console.log("error wrong input in signature: ", err);
            res.render("petition", {
                error: err
            });
        });
});

//********************************

app.get("/edit", (req, res) => {
    db.getProfile(req.session.userId)
        .then(result => {
            console.log("result from getProfile: ", result);
            console.log("result[0].first from getProfile: ", result[0].first);
            res.render("edit", {
                first: result[0].first,
                last: result[0].last,
                email: result[0].email,
                age: result[0].age,
                city: result[0].city,
                url: result[0].url,
                layout: "main"
            });
        })
        .catch(e => console.log("error loading the profile to edit: ", e));
});
//***********************************

app.post("/edit", (req, res) => {
    db.editProfile(
        req.body.first,
        req.body.last,
        req.body.email,
        req.session.userId
    )
        .then(() => {
            if (req.body.password) {
                hash(req.body.password)
                    .then(hash => {
                        db.editPassword(hash, req.session.userId);
                    })
                    .catch(err => {
                        console.log(
                            "error with hashed password when Editing profile",
                            err
                        );
                    });
            }
            db.addEditedProfile(
                req.body.age,
                req.body.city,
                req.body.url,
                req.session.userId
            )
                .then(() => {
                    res.redirect("/thankyou");
                })
                .catch(err => {
                    console.log("error from addEditedProfile", err);
                });
        })
        .catch(err => {
            console.log("error from editProfile", err);
        });
});

//**********************************

app.get("/login", (req, res) => {
    res.render("login", {
        name: "login",
        layout: "main"
    });
});

//**IN LOGIN WE CREATE NEW COOKIES, CAUSE IF THE USER LOGOUT WE LOST THE COOKIES, SO CHECK ON THE DB
app.post("/login", (req, res) => {
    db.getHashedPassword(req.body.email)
        .then(result => {
            console.log("result from getHashedPassword: ", result);
            console.log("hashedPassword: ", result[0].password);
            console.log(
                "id from the user that comes from hashedPass: ",
                result[0].id
            );
            compare(req.body.password, result[0].password)
                .then(match => {
                    if (match == true) {
                        console.log("id: ", result[0].id);
                        req.session.userId = result[0].id;
                        db.getSignature(result[0].id)
                            .then(outcome => {
                                if (outcome.length > 0) {
                                    req.session.cookieId = outcome[0].id;
                                    res.redirect("/thankyou");
                                } else {
                                    res.redirect("/petition");
                                }

                                console.log("outcome[0].id: ", outcome[0].id);
                                console.log(
                                    "outcome from getSignature: ",
                                    outcome
                                );
                                console.log(
                                    "outcome from getSignature[0].signature",
                                    outcome[0].signature
                                );
                            })
                            .catch(e =>
                                console.log("error getting the signature: ", e)
                            );

                        res.redirect("/petition");
                    } else {
                        res.redirect("/thankyou");
                    }
                })
                .catch(error =>
                    console.log("login error match pass in login: ", error)
                );
        })
        .catch(error => console.log("error from getHashedPassword: ", error));
});

app.get("/thankyou", (req, res) => {
    console.log("!!Cookie fom Signature: ", req.session.cookieId);
    db.getSignature(req.session.cookieId)
        .then(signature => {
            console.log("*signature: ", signature);
            // res.render("thankyou");
            res.render("thanks", {
                signature: signature.rows[0].signature,
                layout: "main"
            });
        })
        .catch(err => {
            console.log("error to show the signature: ", err);
            res.redirect("/petition");
        });
});

app.post("/thankyou", (req, res) => {
    db.deleteSignature(req.session.cookieId).catch(err => {
        console.log("err deleting the signature:", err);
        req.session.cookieId = null;
        res.redirect("/petition");
    });
});

app.get("/signers", (req, res) => {
    // console.log("The route is: ", req.url);
    db.getUser()
        .then(signers => {
            console.log(
                "result/row from getUser all data for signers: ",
                signers
            );
            return signers;
        })
        .then(signers => {
            res.render("signers", {
                layout: "main",
                signers: signers
            });
        });
});
//*****************
app.get("/signers/:city", (req, res) => {
    if (!req.session.cookieId) {
        res.redirect("/petition");
    } else {
        console.log("**req.params.city: ", req.params.city);
        db.getLocalSupporters(req.params.city)
            .then(locals => {
                console.log("result from localSupoorters:", locals);

                return locals;
            })
            .then(locals => {
                res.render("city", {
                    layout: "main",
                    locals: locals
                });
            });
    }
});
//***************
app.get("/logout", (req, res) => {
    res.redirect("/registration");
});

app.listen(process.env.PORT || 8080, () => {
    console.log("My express server is running");
});

//20.08, Heroku was set on maintenance, to turn it on again, type on wsl:
// heroku maintenance:off  --> check for photos in cell from 20.08
//https://git.heroku.com/perniax.git
