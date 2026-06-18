const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

let generatedOTP = "";

/* EMAIL CONFIG */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP Error:", error);
    } else {
        console.log("SMTP Server is ready.");
    }
});

/* SEND OTP */

app.post("/send-otp", async (req, res) => {

    const { email } = req.body;

    generatedOTP = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const mailOptions = {
        from: "getinkvision1@gmail.com",
        to: email,
        subject: "Getinkvision OTP Login",
        html: `
            <h2>Getinkvision OTP Verification</h2>
            <p>Your OTP is:</p>
            <h1>${generatedOTP}</h1>
            <p>Please do not share this OTP with anyone.</p>
        `
    };

    try {

        await transporter.sendMail(mailOptions);

        console.log("Generated OTP:", generatedOTP);

        res.json({
            success: true,
            message: "OTP Sent Successfully"
        });

    } catch (error) {

        console.log("Mail Error:", error);

        res.json({
            success: false,
            message: "Error Sending OTP"
        });

    }

});

/* VERIFY OTP */

app.post("/verify-otp", (req, res) => {

    const otp = String(req.body.otp).trim();

    const savedOTP = String(generatedOTP).trim();

    console.log("Entered OTP:", otp);
    console.log("Generated OTP:", savedOTP);

    if (otp === savedOTP) {

        res.json({
            success: true,
            message: "Login Successful"
        });

    } else {

        res.json({
            success: false,
            message: "Invalid OTP"
        });

    }

});

/* START SERVER */

/* SEND ORDER */

app.post("/send-order", async (req, res) => {

    const {
        fullName,
        email,
        phone,
        address,
        city,
        pincode,
        paymentMethod
    } = req.body;

    const mailOptions = {
        from: "getinkvision1@gmail.com",
        to: "getinkvision1@gmail.com",
        subject: "New Order - Getinkvision",
        html: `
            <h2>New Customer Order</h2>

            <p><b>Name:</b> ${fullName}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone}</p>
            <p><b>Address:</b> ${address}</p>
            <p><b>City:</b> ${city}</p>
            <p><b>Pincode:</b> ${pincode}</p>
            <p><b>Payment Method:</b> ${paymentMethod}</p>
        `
    };

    const customerMail = {
    from: "getinkvision1@gmail.com",

    to: email,

    subject: "Order Confirmation - Getinkvision",

    html: `
        <h2>Order Confirmed ✅</h2>

        <p>Dear ${fullName},</p>

        <p>Your order has been placed successfully.</p>

        <p><b>Address:</b> ${address}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>Pincode:</b> ${pincode}</p>
        <p><b>Payment Method:</b> ${paymentMethod}</p>

        <p>
        Expected Delivery:
        3 - 5 Working Days
        </p>

        <h3>Thank you for shopping with Getinkvision.</h3>
    `
};

    try {

    await transporter.sendMail(mailOptions);

    await transporter.sendMail(customerMail);

    res.json({
        success: true,
        message: "Order Submitted Successfully"
    });

} catch(error){

    console.log(error);

    res.json({
        success: false,
        message: "Failed to Submit Order"
    });

}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
