const cors = require("cors");
const express = require("express");
const fs = require("fs");

const app = express();

const port = 8000;

app.use(express.json());
app.use(cors());

const getData = () => {
  const data = fs.readFileSync("data.json");

  return JSON.parse(data);
};

app.get("/members", (req, res) => {
  const data = getData();

  res.send(data);
});

app.get("/member/:id", (req, res) => {
  const data = getData();
  const memberID = req.params.id;

  if (data.hasOwnProperty(memberID)) {
    res.send(data[memberID]);
  } else {
    res.status(400).send("Invalid request: Member does not exist!");
  }
});

app.post("/member", (req, res) => {
  const data = getData();

  try {
    const { id, name, discord_tag, team, role, year } = req.body;
    if (!id || !name || !discord_tag || !team || !role || !year) {
      throw "Missing parameter for adding a new member!";
    }

    const intID = parseInt(id);
    if (data.hasOwnProperty(intID)) {
      throw "Member already exists!";
    }

    data[intID] = {
      name: name,
      discord_tag: discord_tag,
      team: team,
      role: role,
      year: parseInt(year),
    };

    fs.writeFileSync("data.json", JSON.stringify(data));

    res.send("Add member success!");
  } catch (e) {
    res.status(400).send(`Invalid request: ${e}`);
  }
});

app.put("/member", (req, res) => {
  const data = getData();

  try {
    const { id, name, discord_tag, team, role, year } = req.body;
    if (!id || !name || !discord_tag || !team || !role || !year) {
      throw "Missing parameter for editing member details!";
    }

    const intID = parseInt(id);
    if (!data.hasOwnProperty(intID)) {
      throw "Member does not exist!";
    }

    data[intID] = {
      name: name,
      discord_tag: discord_tag,
      team: team,
      role: role,
      year: parseInt(year),
    };

    fs.writeFileSync("data.json", JSON.stringify(data));

    res.send("Edit member success!");
  } catch (e) {
    res.status(400).send(`Invalid request: ${e}`);
  }
});

app.delete("/member", (req, res) => {
  const data = getData();

  try {
    const { id } = req.body;
    if (!id) {
      throw "Missing parameter for deleting member!";
    }

    const intID = parseInt(id);
    if (!data.hasOwnProperty(intID)) {
      throw "Member does not exist!";
    }

    delete data[intID];

    fs.writeFileSync("data.json", JSON.stringify(data));

    res.send("Delete member success!");
  } catch (e) {
    res.status(400).send(`Invalid request: ${e}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
