const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

require(".authorization/auth");
const router = require("./routes/routes");
