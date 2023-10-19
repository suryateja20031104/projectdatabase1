const express = require("express");
const path = require("path");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const dbPath = path.join(__dirname, "userdetails.db");
app.use(express.json());
app.use(cors());
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
  const { username1, password1 } = userDetails;
  const addUserQuery = `
    INSERT INTO
      users (username,password)
    VALUES
      (
        '${username1}',
        '${password1}'
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

app.get("/searchquery", async (request, response) => {
  const { inputtext = "", selectext = "" } = request.query;
  const getCount = `
  SELECT
    count(*) AS C
  FROM
    searchqueries;`;
  const dbResponse = await db.all(getCount);
  const c = dbResponse[0].C;
  const date = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  });
  const instquery = `
          INSERT INTO searchqueries
          (S_ID,S_Start_Time,Search_Param,Search_Value)
          VALUES
          ('${c + 1}','${date}','${selectext}','${inputtext}')
      `;
  const dbResponse1 = await db.run(instquery);
  response.send("OK");
});

app.get("/getCountSearch", async (request, response) => {
  const getSearchCount = `
            SELECT
                count(*) AS SC
            FROM
                searchqueries
            WHERE
            Nb_Status = 0
            OR PC_Status = 0
            OR KSC_Status = 0
            OR BC_Status = 0
            OR WC_Status = 0;
        `;
  const getCompSearchCount = `
        SELECT
            count(*) AS CSC
        FROM
            searchqueries
        WHERE
            Nb_Status = 1
            AND PC_Status = 1
            AND KSC_Status = 1
            AND BC_Status = 1
            AND WC_Status = 1;
    `;
  const searchResponse = await db.all(getSearchCount);
  const searchComplete = await db.all(getCompSearchCount);
  response.send({
    searchResponse: searchResponse[0].SC,
    searchComplete: searchComplete[0].CSC,
  });
});

app.get("/pvtchat", async (request, response) => {
  const getCount = `
  SELECT
    count(*) AS C
  FROM
    searchqueries;`;
  const dbResponse = await db.all(getCount);
  const c = dbResponse[0].C;
  const date = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  });
  const instquery = `
          INSERT INTO Private_Chat
          (PC_ID,PC_Start_Time)
          VALUES
          ('${c}','${date}')
      `;
  const dbResponse1 = await db.run(instquery);
  response.send("OK");
});

app.get("/p", async (request, response) => {
  const getUserDetails = `
    SELECT
      *
    FROM
      Private_Chat
    `;
  const userArray = await db.all(getUserDetails);
  response.send(userArray);
});

app.get("/bot1", async (request, response) => {
  const getCount = `
  SELECT
    count(*) AS C
  FROM
    searchqueries;`;
  const dbResponse = await db.all(getCount);
  const c = dbResponse[0].C;
  const getValues = `
    SELECT Search_Param,Search_Value
    FROM searchqueries
    WHERE S_ID='${c}'
  `;
  const responseValues = await db.all(getValues);
  const searchPram = responseValues[0].Search_Param;
  const searchValue = responseValues[0].Search_Value;
  const verify = `SELECT
  ID1_Type,
  ID2_Number
FROM
  KYC_DATA1
WHERE
  First_Name = '${searchValue}'`;
  const Dresponse = await db.all(verify);
  response.send(Dresponse);
});

app.get("/bot2", async (request, response) => {
  const getCount = `
  SELECT
    count(*) AS C
  FROM
    searchqueries;`;
  const dbResponse = await db.all(getCount);
  const c = dbResponse[0].C;
  const getValues = `
    SELECT Search_Param,Search_Value
    FROM searchqueries
    WHERE S_ID='${c}'
  `;
  const responseValues = await db.all(getValues);
  const searchPram = responseValues[0].Search_Param;
  const searchValue = responseValues[0].Search_Value;
  const verify = `SELECT
  ID1_Type,
  ID2_Number
FROM
  KYC_DATA2
WHERE
  First_Name = '${searchValue}'`;
  const Dresponse = await db.all(verify);
  response.send(Dresponse);
});

app.get("/bot3", async (request, response) => {
  const getCount = `
  SELECT
    count(*) AS C
  FROM
    searchqueries;`;
  const dbResponse = await db.all(getCount);
  const c = dbResponse[0].C;
  const getValues = `
    SELECT Search_Param,Search_Value
    FROM searchqueries
    WHERE S_ID='${c}'
  `;
  const responseValues = await db.all(getValues);
  const searchPram = responseValues[0].Search_Param;
  const searchValue = responseValues[0].Search_Value;
  const verify = `SELECT
  ID1_Type,
  ID2_Number
FROM
  KYC_DATA3
WHERE
  First_Name = '${searchValue}'`;
  const Dresponse = await db.all(verify);
  response.send(Dresponse);
});

app.get("/getDet", async (request, response) => {
  const askDet = `
  SELECT
    count(*) AS C
  FROM
    searchqueries;`;
  const dbResponse = await db.all(askDet);
  const c = dbResponse[0].C;
  const getValues = `
    SELECT Search_Param,Search_Value
    FROM searchqueries
    WHERE S_ID='${c}'
  `;
  const responseValues = await db.all(getValues);
  const searchPram = responseValues[0].Search_Param;
  const searchValue = responseValues[0].Search_Value;
  response.send({ searchPram: searchPram, searchValue: searchValue });
});

app.get("/storePvtchat", async (request, response) => {
  const { chatlog = "" } = request.query;

  const getCount = `
  SELECT
    count(*) AS C
  FROM
    searchqueries;`;
  const dbResponse = await db.all(getCount);
  const c = dbResponse[0].C;
  const date = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  });
  const instquery = `
          UPDATE Private_Chat
          SET PC_Status=1,PC_Chat_Log='${chatlog}',PC_End_Time='${date}'
          WHERE PC_ID=${c};
      `;
  const dbResponse1 = await db.run(instquery);
  response.send("OK");
});

app.get("/gp", async (request, response) => {
  const getUserDetails = `
    SELECT
      *
    FROM
      Private_Chat
    `;
  const userArray = await db.all(getUserDetails);
  response.send(userArray);
});

app.get("/stage1", async (request, response) => {
  const getCount = `
  SELECT
    count(*) AS C
  FROM
    searchqueries;`;
  const dbResponse = await db.all(getCount);
  const c = dbResponse[0].C;

  const instquery = `
          SELECT PC_Status AS P
          FROM Private_Chat
          WHERE PC_ID=${c};
      `;
  const dbResponse1 = await db.all(instquery);
  if (dbResponse1[0].P === 1) {
    response.send(true);
  } else {
    response.send(false);
  }
});
