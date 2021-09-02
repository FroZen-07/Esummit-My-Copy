"use strict";
var express = require("express");
var app = express();

var ocMemberModel = require("./models/ocMemberSchema");
var caMemberModel = require("./models/caMemberSchema");
const { sendMail } = require("./utilities/mailer");
const { db } = require("./utilities/dbConnect");

const { GoogleSpreadsheet } = require("google-spreadsheet");

async function insertIntoSheet(caName, caInstitution, caEmail, caApplID) {
  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(
    "1VU4RvXzVnZKcwzWubboaO5nWfuVSd-D4Jn05uMtW72Q"
  );

  await doc.useServiceAccountAuth({
    client_email: "esummit21@ju-repo.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCYimcrAx2xG7zq\nVCt2Rn2Kkl9AxXxMnrsZGhKw2h5z0ovpvnvHZ1MVcnN4zOxuZCH4e/UMDMf5u+Fz\nv97JUSze7/9bf4vNsKa+E17OBMJQIDBPAR/Hz1Qic8/bCGAX6wFl/OZG87qiWnJf\nhnuUymPo2h4VUuxjSQjWdI0ERqkxcR/l2Gdi5teM4PJZc+vA2QOVtVdBG/XMgK1S\nf8k4gah7Ae0Q3h6f8MoXbYaNoFhSKo7rzkkbUAsMLVzusCIJcLCpI1Ba7UwlQ6b5\nMxGyRcovbWpyno8L7S6cPKEajoAZ1yjcstgSxXdm9JsWweK6fAuJv2077EKVp2QJ\nJAMEBpKHAgMBAAECggEAGXlPhlLUZA3WTCm3Ql6+O2R7TMVOHzuI0kXU5jzexgfc\nvrHFWQULznKZDwzl1P+a3rTQtOzzfmSeX2ak7WjFfguFUQHpVnXQOsDgXbZUvu3J\nM4BkDsm0arZ9eT4aUhQ4XRBRYnr0aYWCQSqju7La4Xl/eZ8qA+Cf/bRkElk8ixlv\nqhfIr/m8dKSAx0ImMar7R8IazUw4Y2RPQaidcoDg9jxDl+5XbzB+5vJqRrRBzi4g\nAgD0AjZYKYsIZkhSKXhT5Fo5ICpi4sG53KKaNV9iu41Riiw3O9gEqLJ/5eeJBwCI\ng2kEEyGXFjx1AcvDZz92MtpWveI1/EIl7Hp+aS7oPQKBgQDL0mX3gBV9gqjajOmZ\nxcvOrjrZsHhlMWDZr3qQzuUhv771q8qWYv7q8+QZrtBedtHGt2pJ4Q94aO3UNAN6\nZ2Vc/E7+O/8FaeWKTejQd9Ei+qKDqY+eW4Sv4VDmGaGU1KYiCJaseiuWAg+70rJK\nk2YqZRh0ifumA+njVKOlmQZBHQKBgQC/l0FMWXIbMRtw71vwAEl5YACBoCV/AHXI\nwsa9v6uIQstBreSpB/plOkPkHRPqCNHuFTwsiBOhY2AMb2LbuqPNemts7eFOD8JB\ntirnNauJfV90N7zFTEE7zeAUZMI7heaM2N6PNr33npAZL+dJlTlUUtMeiT245W3g\nW8tAwpqU8wKBgAFFod9GjFvJKfabNIYCJwB2M+XR5R50jW8uWix3LhTk1nNADDae\nDYs31G+YmLJOOYbs9Bvb7LXKqdlOLctgw9Atvux1QWUuQQF49QAAD20RdVwu/bd2\nSMC0PkYBWPHN1e+WcCJJbOY1wxVf/j7a5qNTGDD5/3kMwzPo/lB1QQW9AoGADUWx\nJFTd7rxMJlquh8W9UUcxQcmST2X8wtebZPGuNFZMNlSRjpQa6IBMy7Sn+IJ76H5Y\nGM2kbn2v3aypsIcRad6dKoKgJQQ6dMrl1faF15Rz1F04GoLZ0gbFCySfv/farM8p\nO8qTBmBZoyUKZLKNsiW6slbXi8N5BR3Wyrmwc7kCgYAYqIdoNUY1yeZv7Iyr5rUA\nKBYR+YTgl7b0m0Q2SqOxzE+k2gbxrhbhiO0p9tZs/xZURnQ/Yd/0CVHSkVgMF0Fi\nPI1fqRDPSr+0jgfIR33icOBfnBnERbf+bWoQYx74Dstlww2TLo54Y+RJfCXe47mV\n22tilquq96KCy3mvQd2kvg==\n-----END PRIVATE KEY-----\n",
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);
  const sheet = doc.sheetsByIndex[1]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);

  const insertionRow = await sheet.addRow({
    "Full Name": caName,
    Institution: caInstitution,
    Email: caEmail,
    "CA Application ID": caApplID,
    Status: "Pending",
  });
}

app.use(express.json()); //Used to parse JSON bodies

//Parse URL-encoded bodies
app.use(
  express.urlencoded({
    extended: true,
  })
);

// set the view engine to ejs
app.set("view engine", "ejs");

// serve static assets
app.use(express.static(__dirname + "/views"));

// home page
app.get("/", function (req, res) {
  res.render("pages/home", {
    home: 1,
    legacy: 0,
    events: 0,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// legacy page
app.get("/legacy", function (req, res) {
  res.render("pages/comingsoon", {
    home: 0,
    legacy: 1,
    events: 0,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// events page
app.get("/events", function (req, res) {
  res.render("pages/events", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// LaunchX page
app.get("/launchx", function (req, res) {
  res.render("pages/launchx", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// InspiraTalks page
app.get("/inspiratalks", function (req, res) {
  res.render("pages/inspiratalks", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// ManagerHustle page
app.get("/managerhustle", function (req, res) {
  res.render("pages/managerhustle", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// MockAuction page
app.get("/mockauction", function (req, res) {
  res.render("pages/mockauction", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// HackNPitch page
app.get("/hacknpitch", function (req, res) {
  res.render("pages/hacknpitch", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// Analyst page
app.get("/analyst", function (req, res) {
  res.render("pages/analyst", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// Mock Stock page
app.get("/mockstock", function (req, res) {
  res.render("pages/mockstock", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// Mock Crypto page
app.get("/mockcrypto", function (req, res) {
  res.render("pages/mockcrypto", {
    home: 0,
    legacy: 0,
    events: 1,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// schedule page
app.get("/schedule", function (req, res) {
  res.render("pages/schedule", {
    home: 0,
    legacy: 0,
    events: 0,
    schedule: 1,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// sponsors page
app.get("/sponsors", function (req, res) {
  res.render("pages/sponsors", {
    home: 0,
    legacy: 0,
    events: 0,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 0,
    sponsors: 1,
  });
});

// Latest posts page
app.get("/latest", function (req, res) {
  res.render("pages/latest", {
    home: 0,
    legacy: 0,
    events: 0,
    schedule: 0,
    ca: 0,
    latest: 1,
    contact: 0,
    sponsors: 0,
  });
});

// CA page
app.get("/ca", function (req, res) {
  res.render("pages/ca", {
    home: 0,
    legacy: 0,
    events: 0,
    schedule: 0,
    ca: 1,
    latest: 0,
    contact: 0,
    sponsors: 0,
  });
});

// CA page
app.post("/ca/apply", function (req, res) {
  res.render("pages/ca-apply", {
    home: 0,
    legacy: 0,
    events: 0,
    schedule: 0,
    ca: 1,
    latest: 0,
    contact: 0,
    sponsors: 0,
    formData: req.body,
    isSuccess: -1,
  });
});

// Contact page
app.get("/contact", function (req, res) {
  res.render("pages/contact", {
    home: 0,
    legacy: 0,
    events: 0,
    schedule: 0,
    ca: 0,
    latest: 0,
    contact: 1,
    sponsors: 0,
  });
});

// oc-applications page
// app.get("/", function (req, res) {
//   res.render("pages/oc-apply", { isSuccess: -1 });
// });

// oc-applications page
// app.get("/admin", function (req, res) {
//   ocMemberModel.find(function (err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       // res.send(data);
//       res.render("pages/view-oc-applications", { applications: data });
//     }
//   });
// });

app.post("/ca/apply/submit", (req, res) => {
  // console.log("Data: ", req.body);
  const {
    name,
    university,
    department,
    degree,
    currently_pursuing,
    grad_yr,
    email,
    phone,
    age,
    gender,
    why_ca,
    innovative_things,
    popular,
    linkedin,
    facebook,
    instagram,
  } = req.body;

  // Creating new model
  var new_caMember = new caMemberModel({
    name: name,
    university: university,
    department: department,
    degree: degree,
    currently_pursuing: currently_pursuing,
    grad_yr: grad_yr,
    email: email,
    phone: phone,
    age: age,
    gender: gender,
    why_ca: why_ca,
    innovative_things: innovative_things,
    popular: popular,
    linkedin: linkedin,
    facebook: facebook,
    instagram: instagram,
  });

  new_caMember.save(function (err, data) {
    if (err) {
      console.log(err);
      // Redirect to error page
      res.render("pages/ca-apply", {
        isSuccess: 0,
        home: 0,
        legacy: 0,
        events: 0,
        schedule: 0,
        ca: 1,
        latest: 0,
        contact: 0,
        sponsors: 0,
      });
    } else {
      // Send application receipt mail to applicant
      let isHTML = false;
      let content = `Thank You ${name} ! \nYour Application for being a Campus Ambassador for Jadavpur University E-Summit has been successfully submitted.
      \nWe'll get back to you soon after a quick review.
      \nApplication ID. : ${data._id}\n\nCheers,\nTeam JU E-Cell`;

      let subject = "Campus Ambassador Application";

      sendMail(content, email, subject, isHTML).catch(console.error);

      console.log(typeof data._id);

      insertIntoSheet(name, university, email, data._id);

      // Redirect to success page
      res.render("pages/ca-apply", {
        name,
        id: data._id,
        // referralCode:
        // "JUCA" + JSON.stringify(data._id).toUpperCase().substr(-5, -1),
        isSuccess: 1,
        home: 0,
        legacy: 0,
        events: 0,
        schedule: 0,
        ca: 1,
        latest: 0,
        contact: 0,
        sponsors: 0,
      });
    }
  });
});

app.post("/oc-apply-submit", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    gradYear,
    interestDepartment,
    interests,
    portfolioLink,
  } = req.body;

  // Creating new model
  var new_ocMember = new ocMemberModel({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    department: department,
    gradYear: gradYear,
    interestDepartments: interestDepartment,
    interests: interests,
    portfolioLink: portfolioLink,
  });

  new_ocMember.save(function (err, data) {
    if (err) {
      console.log(err);
      // Redirect to error page
      res.render("pages/oc-apply", { isSuccess: 0 });
    } else {
      // Send application receipt mail to applicant
      let isHTML = false;
      let content = `Thank You ${firstName} ! \nYour Application for being a member in the Organizing Committee for Jadavpur University E-Summit has been successfully submitted.
      \nWe'll get back to you soon after a quick review.
      \nApplication ID. : ${data._id}\n\nCheers,\nTeam JU E-Cell`;

      let subject = "OC Member Application";

      sendMail(content, email, subject, isHTML).catch(console.error);

      // Redirect to success page
      res.render("pages/oc-apply", { firstName, id: data._id, isSuccess: 1 });
    }
  });
});

const port = process.env.PORT;
// const port = 3001;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
