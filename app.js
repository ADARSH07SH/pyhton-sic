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
app.use(express.json());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];

const responses = {
  hi: ["Hello!", "Hi there!", "Hi, how are you?"],
  "how are you": [
    "I'm doing well, thanks for asking!",
    "I'm fine, how about you?",
  ],
  "what's your name": ["My name is Chatbot.", "You can call me Chatbot."],
  bye: ["Goodbye!", "Bye!", "See you later!"],
  "we have problem with roads": [
    '<a href="https://transport.karnataka.gov.in/" target="_blank">Road Transport Information</a>',
  ],
  "i want to place a complaint": [
    '<a href="https://ksp.karnataka.gov.in/" target="_blank">Place a Complaint</a>',
  ],
  "i want to know about labour department": [
    '<a href="https://labour.karnataka.gov.in/" target="_blank">Labour Department Info</a>',
  ],
  "i want to get news about education department": [
    '<a href="https://primaryedu.karnataka.gov.in/" target="_blank">Education Department News</a>',
  ],
  "i want transportation information of karnataka": [
    '<a href="https://transport.karnataka.gov.in/" target="_blank">Transportation Info</a>',
  ],
  "i want to know about medical info of karnataka": [
    '<a href="https://dme.karnataka.gov.in/" target="_blank">Medical Information</a>',
  ],
  "i want to know about agriculture information": [
    '<a href="https://raitamitra.karnataka.gov.in/" target="_blank">Agriculture Information</a>',
  ],
  "i want to know about horticulture": [
    '<a href="https://horticulturedir.karnataka.gov.in/" target="_blank">Horticulture Information</a>',
  ],
  emergency: ["Call 112"],
  more: [
    '<a href="https://karnataka.gov.in/department" target="_blank">More Information</a>',
  ],
  "i need information on social justice": [
    '<a href="https://socialjustice.karnataka.gov.in/" target="_blank">Social Justice Information</a>',
  ],
  "i want to check land records": [
    '<a href="https://landrecords.karnataka.gov.in/" target="_blank">Check Land Records</a>',
  ],
  "i need to apply for a driving license": [
    '<a href="https://transport.karnataka.gov.in/english" target="_blank">Apply for Driving License</a>',
  ],
  "i want to check property tax details": [
    '<a href="https://bbmp.gov.in/en/property-tax" target="_blank">Check Property Tax Details</a>',
  ],
  "how do i apply for aadhar card": [
    '<a href="https://uidai.gov.in/" target="_blank">Apply for Aadhar Card</a>',
  ],
  "how to get voter id": [
    '<a href="https://voterportal.eci.gov.in/" target="_blank">Get Voter ID</a>',
  ],
  "i need information on pension schemes": [
    '<a href="https://pensionersportal.gov.in/" target="_blank">Pension Schemes Information</a>',
  ],
  "how to get ration card": [
    '<a href="https://ahara.kar.nic.in/" target="_blank">Get Ration Card</a>',
  ],
  "where to pay water bill": [
    '<a href="https://bwssb.karnataka.gov.in/" target="_blank">Pay Water Bill</a>',
  ],
  "how to get birth certificate": [
    '<a href="https://www.karnataka.gov.in/birthcertificate" target="_blank">Get Birth Certificate</a>',
  ],
  "i want to know about covid-19 guidelines": [
    '<a href="https://covid19.karnataka.gov.in/" target="_blank">COVID-19 Guidelines</a>',
  ],
  default: [
    "Sorry, I didn't understand that.",
    "Could you please rephrase that?",
    "I'm not sure I follow.",
  ],
};


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
    res.redirect("/login");
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Verify user credentials
  const sql = "SELECT * FROM user_info WHERE username = ?";
  connection.query(sql, [username], async (err, result) => {
    if (err) {
      console.error("Error logging in: " + err.message);
      res.status(500).send("Error logging in");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("Invalid username or password");
      return;
    }

    const user = result[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      res.status(404).send("Invalid username or password");
      return;
    }

    console.log("User logged in successfully");
    res.render("user-home", { username });
  });
});

app.post("/get_response", (req, res) => {
  const userInput = req.body.user_input.toLowerCase();
  const botResponse = responses[userInput] || responses["default"];
  res.json({ response: botResponse });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
