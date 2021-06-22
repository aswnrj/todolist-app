const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/usersDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  items: [itemSchema],
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home", {
    pageKey: "register",
    wrongPassword: false,
    notMatch: false,
    fullName: "",
    email: "",
  });
});

app.get("/register", (req, res) => {
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("home", {
    pageKey: "login",
    wrongPassword: false,
    notMatch: false,
    fullName: "",
    email: "",
  });
});

app.get("/dashboard", (req, res) => {
  User.findOne({}, (err, foundUser) => {
    if (!err) {
      if (!foundUser) {
        res.send("Go to /register and Add a use first.");
      } else {
        res.render("dashboard", {
          name: foundUser.name,
          listItems: foundUser.items,
        });
      }
    }
  });
});

app.post("/register", (req, res) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password !== confirmPassword) {
    res.render("home", {
      pageKey: "register",
      wrongPassword: true,
      notMatch: false,
      fullName: fullName,
      email: email,
    });
  } else {
    const newUser = new User({
      name: fullName,
      email: email,
      password: password,
      items: [],
    });
    newUser.save((err) => {
      if (err) console.log(err);
      else console.log("User saved");
      res.redirect("/dashboard");
    });
  }
});

app.post("/login", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }, (err, foundUser) => {
    if (!err) {
      if (!foundUser) {
        res.redirect("/register");
      } else {
        if (foundUser.password === password) {
          res.redirect("/dashboard");
        } else {
          res.render("home", {
            pageKey: "login",
            wrongPassword: false,
            notMatch: true,
            fullName: "",
            email: "",
          });
        }
      }
    }
  });
});

app.post("/additem", (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });
  User.findOne({}, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        foundUser.items.push(item);
        foundUser.save();
        res.redirect("/dashboard");
      }
    }
  });
});

app.post("/delete", function (req, res) {
  let deleteItems = req.body.item;
  if (!Array.isArray(deleteItems)) deleteItems = [deleteItems];
  User.findOne({}, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        let prevItems = foundUser.items;
        deleteItems.forEach((deleteItem) => {
          prevItems = prevItems.filter((item) => item.name !== deleteItem);
        });
        foundUser.items = prevItems;
        foundUser.save();
        res.redirect("/dashboard");
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
