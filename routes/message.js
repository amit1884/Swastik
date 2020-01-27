var express = require('express');
var router = express.Router(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("../models/user"),
    Child = require("../models/child"),
    Parent = require("../models/parent");

const Nexmo = require('nexmo');

mongoose.connect('mongodb://localhost:27017/swastik', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("db connected in protect route");
});

router.use(require("express-session")({
    secret: "secret!",
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.send("Here is nothing for you go to index page")
})

router.get("/phonenos", (req, res) => {
    var phonenos = [];
    var today = req.body.date;
    console.log(today);
    Child.find({ "vaccinations.duedate": today }, (err, ward) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(ward);
            ward.forEach((child) => {
                if (child.Mphoneno) {
                    phonenos.push(child.Mphoneno);
                    console.log(child.Mphoneno);
                }
                if (child.Fphoneno) {
                    console.log(child.Fphoneno);
                    phonenos.push(child.Fphoneno);
                }
                console.log(phonenos)
            })
        }
    });
    setTimeout(() => {
        res.send(phonenos);
    }, 1000);
});

const nexmo = new Nexmo({
    apiKey: '0d4daa02',
    apiSecret: 'SAHw2cuS28PlWHNQ'
}, { debug: true });


router.post('/sendtoall', (req, res) => {
    var arr = req.body.nos;
    console.log(arr);
    const text = "helllo i am atul from nodejs";
    for (var number in arr) {
        arr[number]="91"+arr[number];
        console.log(arr[number]);
        nexmo.message.sendSms(
            '918957790795', arr[number], text, { type: 'unicode' },
            (err, responseData) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.dir(responseData);
                }
            }
        );

    }
    // res.send("Messages Sent!!");

});

router.get("/email", (req, res) => {
    var phonenos = [];
    var today = req.body.date;
    console.log(today);
    Child.find({ "vaccinations.duedate": today }, (err, ward) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(ward);
            ward.forEach((child) => {
                if (child.Mphoneno) {
                    // phonenos.push(child.Mphoneno);

                    console.log(child.Mphoneno);
                }
                if (child.Fphoneno) {
                    console.log(child.Fphoneno);
                    phonenos.push(child.Fphoneno);
                }
                console.log(phonenos)
            })
        }
    });
    setTimeout(() => {
        res.send(phonenos);
    }, 1000);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;