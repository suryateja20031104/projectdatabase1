const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "userdetails.db");
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/", async (request, response) => {
  const getUserDetails = `
    SELECT
      *
    FROM
      users
    `;
  const userArray = await db.all(getUserDetails);
  response.send(userArray);
});

app.post("/users/", async (request, response) => {
  const userDetails = request.body;
  const { username, password } = userDetails;
  const addUserQuery = `
    INSERT INTO
      users (username,password)
    VALUES
      (
        '${username}',
        '${password}'
      );`;

  const dbResponse = await db.run(addUserQuery);
  const userId = dbResponse.lastID;
  response.send({ info: "Success register" });
});

app.get("/userConformation/", async (request, response) => {
  const { username = "", password = "" } = request.query;
  const getBooksQuery = `
    SELECT
      *
    FROM
     users
    WHERE
     username LIKE '%${username}%';`;
  try {
    const booksArray = await db.all(getBooksQuery);
    response.send(booksArray[0].password === password);
  } catch (error) {
    response.send("false");
  }
});
