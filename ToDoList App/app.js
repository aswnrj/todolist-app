const express = require("express");
const ejs = require("ejs");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home", {
        pageKey: "register"
    });
});

app.get("/register", (req, res) => {
    res.redirect("/");
});

app.get("/login", (req, res) => {
    res.render("home", {
        pageKey: "login"
    });
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard", {
        name: "Aswin"
    });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});