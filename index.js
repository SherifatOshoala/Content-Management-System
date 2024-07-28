const landing = require("./routes");
const userRoute = require("./routes/userRoute.js");
const articleRoute = require("./routes/articleRoute.js");
const categoryRoute = require("./routes/categoryRoute.js");

const displayRoutes = require("express-routemap");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.APP_PORT || 3000;
const connection = require("./config/sql.js")

app.use(express.json());
app.use(landing)
app.use(userRoute)
app.use(articleRoute)
app.use(categoryRoute)


connection.connect((error) => {
  if (error) {
    console.log("There was an error connecting to the database: ",error.message)
    process.exit(1);
  } else {
    console.log("Content_MS Database connected!");
    app.listen(port, () => {
      displayRoutes(app)
      console.log(`WeBlog is running on port ${port}`);
    });
  }
});




