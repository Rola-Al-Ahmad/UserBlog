const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
const User = require("./models/userSchema");
app.set("view engine", "ejs");
app.use(express.static("public"));
var moment = require("moment");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(cors());

app.use(express.json());
// Auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// GET Requst
app.get("/", (req, res) => {
  // result ==> array of objects
  console.log("--------------------------------------------");
  User.find()
    .then((result) => {
      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

app.get("/edit/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/edit", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/view/:id", (req, res) => {
  // result ==> object
  User.findById(req.params.id)
    .then((result) => {
      res.render("user/view", { obj: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});



app.post('/check-email', async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    res.json({ emailExists: true });
  } else {
    res.json({ emailExists: false });
  }
});

// POST Requst
app.post("/user/add.html", (req, res) => {
  console.log(req.body);
  User.create(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});



app.post("/search", (req, res) => {
  console.log("*******************************");

  const searchText = req.body.searchText.trim()
  const searchQuery = {
    $or: [
      { firstName: { $regex: `^${searchText}`, $options: 'i' } },
      { lastName: { $regex: `^${searchText}`, $options: 'i' } },
      { country: { $regex: `^${searchText}`, $options: 'i' } },
    ]
  };

  // Find users matching the search query
  User.find(searchQuery)
    .then((result) => {
      console.log(result);
      res.render("user/search", { searchText: searchText ,arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

// DELETE Request
app.delete("/edit/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.redirect("/");
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// PUT Requst
app.put("/edit/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

mongoose
  .connect('')//add mongodb url here
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

