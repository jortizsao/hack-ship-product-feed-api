import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

const port = process.env.PORT || 3000;

// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.status(500).send(err);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
