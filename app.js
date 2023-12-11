const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/contactApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Contact schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Contact = mongoose.model("Contact", contactSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Render the initial page with existing contacts
app.get("/", async (req, res) => {
  const contacts = await Contact.find();
  res.render("index", { contacts });
});

// Handle form submission to add a new contact
app.post("/addContact", async (req, res) => {
  const { name, email, phone } = req.body;

  // Create a new contact and save it to the database
  const newContact = new Contact({ name, email, phone });
  await newContact.save();

  // Redirect back to the homepage
  res.redirect("/");
});

//EDIT

// Render the edit page for a specific contact
app.get("/edit/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.render("edit", { contact });
});

// Handle form submission to update a contact
app.post("/edit/:id", async (req, res) => {
  const { name, email, phone } = req.body;

  // Update the contact in the database
  await Contact.findByIdAndUpdate(req.params.id, { name, email, phone });

  // Redirect back to the homepage
  res.redirect("/");
});

// DELETE

// Delete a contact and redirect back to the homepage
app.get("/delete/:id", async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
