const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    res.render("index", { allFiles: files });
  });
});

app.get(`/file/:filename`, (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, fileData) => {
    res.render("show", { fileName: req.params.filename, fileData: fileData });
  });
});

app.get(`/rename/:filename`, (req, res) => {
  res.render("rename", { fileName: req.params.filename });
});

app.post("/rename", (req, res) => {
  let str = req.body.newtitle;
  str = str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  fs.rename(
    `./files/${req.body.oldtitle}`,
    `./files/${str}.txt`,
    (err) => {
      if (err) console.log(err);
      else {
        console.log("File renamed successfully\n");
      }
      res.redirect("/");
    }
  );
});

app.post("/create", (req, res) => {
  let str = req.body.title;
  str = str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  fs.writeFile(`./files/${str}.txt`, req.body.description, (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
    }
    res.redirect("/");
  });
});

app.listen(3001);
