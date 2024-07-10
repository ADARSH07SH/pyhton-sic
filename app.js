const express = require("express");
const app = express();
const path = require("path");
const port = 8000;
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "project",
  password: "adarsh1947",
  port: 3306,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

const states = [
  // Your list of states here...
];

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/grievance", (req, res) => {
  res.render("grievance", { states: states });
});

app.post("/submit_grievance", (req, res) => {
  const { name, number, state, description } = req.body;

  const sql =
    "INSERT INTO grievances (name, number, state, description) VALUES (?, ?, ?, ?)";
  connection.query(sql, [name, number, state, description], (err, result) => {
    if (err) {
      console.error("Error inserting grievance: " + err.message);
      res.status(500).send("Error submitting grievance");
      return;
    }
    console.log("Grievance submitted successfully");
    res.render("grievance_id", { grievanceId: result.insertId });
  });
});

app.get("/grievance/status", (req, res) => {
  res.render("grievance_status_input");
});

app.post("/grievance/status", (req, res) => {
  const grievanceId = req.body.grievanceId;

  const sql = "SELECT * FROM grievances WHERE id = ?";
  connection.query(sql, [grievanceId], (err, result) => {
    if (err) {
      console.error("Error fetching grievance: " + err.message);
      res.status(500).send("Error fetching grievance");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("Grievance not found");
      return;
    }

    res.render("grievance_status", { grievance: result[0] });
  });
});

app.get("/login", (req, res) => {
  res.render("signin");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Implement your login logic here.
  // For example, check username and password against database records.

  res.send("Login functionality not implemented yet.");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql =
    "INSERT INTO user_info (username, email, password) VALUES (?, ?, ?)";
  connection.query(sql, [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Error inserting user: " + err.message);
      res.status(500).send("Error registering user");
      return;
    }
    console.log("User registered successfully");
    res.send("Registration successful");
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Verify user credentials
  const sql = "SELECT * FROM user_info WHERE username = ? AND password = ?";
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error logging in: " + err.message);
      res.status(500).send("Error logging in");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("Invalid username or password");
      return;
    }

    console.log("User logged in successfully");
    res.render("user-home", { username });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
