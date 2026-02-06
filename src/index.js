import dotenv from "dotenv";
import app from "./app.js";
import myDB from "./db/index.js";

// dotenv.config({
//   path: "./.env",
// });

dotenv.config();

const port = process.PORT || 3000;

myDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
