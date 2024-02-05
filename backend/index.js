const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rootRouter = require("./routes/index");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5173", // Change this to the actual origin of your client
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("app listening on port 3000");
});
