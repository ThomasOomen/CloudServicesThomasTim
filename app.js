const express = require("express");
app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const port = 3000

app.use('/', require("./routes/routes"));

app.get('/', (req, res) => {
    res.send('Hello World!')
});
  
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})