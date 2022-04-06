const express = require("express");
app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const port = 3000
const router = require("./routes/routes");

app.use('/', router);

  
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})