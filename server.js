const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3005;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb+srv://and1roxx43:Mar12Nat10240568@cluster0.j5j1s.mongodb.net/BudgetTracker?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useFindAndModify: false
});

app.use(require("./routes/api.js"));

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));

