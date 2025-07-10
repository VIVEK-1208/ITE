require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const gmailEmail = process.env.gmailEmail;
const gmailPassword = process.env.gmailPassword;
const twilioSID = process.env.twilioSID;
const twilioAuthToken = process.env.twilioAuthToken;
const twilioPhone = process.env.twilioPhone;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const client = twilio(twilioSID, twilioAuthToken);

exports.notifyOnOrderStatusChange = functions.firestore
    .document("orders/{orderId}")
    .onUpdate(async (change, context) => {
      const before = change.before.data();
      const after = change.after.data();

      if (before.status === after.status) return null;

      const orderId = context.params.orderId;
      const userEmail = after.deliveryInfo && after.deliveryInfo.email;

      const userPhone = after.deliveryInfo && after.deliveryInfo.phone;
      const fullName =
  (after.deliveryInfo && after.deliveryInfo.firstName || "") + " " +
  (after.deliveryInfo && after.deliveryInfo.lastName || "");

      const newStatus = after.status;
      const total = after.total;

      // Email content
      const mailOptions = {
        from: `"ITE Shop" <${gmailEmail}>`,
        to: userEmail,
        subject: `Your Order ${orderId} is now ${newStatus}`,
        html: `
        <p>Hi ${fullName},</p>
        <p>Your order <strong>${orderId}</strong> has been updated to 
        <strong>${newStatus}</strong>.</p>
        <p>Total: ₹${total}</p>
        <p>Thanks for shopping with us!</p>
      `,
      };

      // SMS content
      const smsBody = `
Hi ${fullName}, your ITE order ${orderId} status is now "${newStatus}".
Total: ₹${total}
`;

      try {
      // Send Email
        if (userEmail) {
          await transporter.sendMail(mailOptions);
          console.log("✅ Email sent to", userEmail);
        }

        // Send SMS
        if (userPhone) {
          await client.messages.create({
            body: smsBody,
            from: twilioPhone,
            to: `+91${userPhone}`,
          });
          console.log("✅ SMS sent to", userPhone);
        }

        return null;
      } catch (error) {
        console.error("❌ Notification error:", error);
        return null;
      }
    });
