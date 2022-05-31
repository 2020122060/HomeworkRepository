const express = require("express");

const app = express();

app.use(express.static("LAB5"));
app.get("/", (req, res) => {
  res.send("hi");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("http://localhost:8000");
});
