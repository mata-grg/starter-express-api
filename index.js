const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

const username = "p3v1tml8@duck.com";
const password =
  "aa56299bf085461221c7281003e90b96ba5f69588bf47dcc3a1b47431a450d5c";

app.post("/send-email", async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: `https://mossyoak.gorgias.com/api/tickets/${req.body.ticket_id}`,
      auth: {
        username: username,
        password: password,
      },
    });

    const formattedText = response.data.messages.map((item, index) => {
      return {
        role: item.from_agent ? "agent" : "customer",
        content: item.stripped_text,
      };
    });

    const suggestedReplyResponse = await axios({
      method: "post",
      url: "https://dev.hiabstract.com/suggested-response",
      data: {
        ticket_id: req.body.ticket_id,
        customer_id: response.data.customer.id,
        brand: "fellow",
        messages: formattedText,
      },
    });

    // Configure Nodemailer with your email credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "muhammad.ata.grg@gmail.com",
        pass: "cbkr nxok cvza afid",
      },
    });

    // Define the email options
    const mailOptions = {
      from: "muhammad.ata.grg@gmail.com",
      to: "muhammad.ata.grg@gmail.com",
      subject: "stringified body",
      text: `Received data:\n${JSON.stringify(
        suggestedReplyResponse,
        null,
        2
      )}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({
          message: `Email processed successfully ${req.body.ticket_id}`,
        });
      }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Internal Server Error", error);
  }
});

app.get("/", (req, res) => {
  console.log("Just got a request!");
  res.send("CHECKED!!!!!!!!!!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
