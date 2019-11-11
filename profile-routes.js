// profile-routes

const express = require("express");
const router = (exports.router = express.Router());

//works similar that app, app is for servers, router is for routes,
//require DB and the rest of midddleware,
//keeps our code modular

router.get("/profile", (req, res) => {
    res.sendStatus(200);
});

router.post("/edit", (req, res) => {
    res.sendStatus(200);
});

router.get("/edit", (req, res) => {
    res.sendStatus(200);
});

router.post("/profile", (req, res) => {
    res.sendStatus(200);
});
