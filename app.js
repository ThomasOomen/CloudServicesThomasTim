const express = require("express");
app = express();
const mongoose = require("mongoose");
const passport = require("passport");

app.use('/', require("./routes/routes"));