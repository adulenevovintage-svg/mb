import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import twilio from 'twilio';
import dotenv from 'dotenv';

// Load environment variables for local testing (cPanel uses its own UI for this)
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Twilio
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;

let lastTelegramResponse = null;

// API Route for notifications
app.post("/api/notify-barber", async (req, res) => {
  const { name, phone, service, date, time } = req.body;

  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const messageText = `
💈 NEW RESERVATION 💈
--------------------
👤 Customer: ${name}
📞 Phone: ${phone}
✂️ Service: ${service}
📅 Date: ${formattedDate}
⏰ Time: ${time}
--------------------
  `.trim();

  const results = {
    email: { success: false },
    telegram: { success: false },
    sms: { success: false }
  };

  // 1. Send Email (Resend)
  if (resend) {
    try {
      const recipientEmail = process.env.BARBER_EMAIL || 'amef221412@gmail.com';
      await resend.emails.send({
        from: 'MB Barber Shop <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `New Reservation: ${name}`,
        html: `<div style="font-family: sans-serif; padding: 20px;"><h2>New Booking</h2><p><strong>Customer:</strong> ${name}</p><p><strong>Service:</strong> ${service}</p><p><strong>Time:</strong> ${formattedDate} at ${time}</p></div>`
      });
      results.email.success = true;
    } catch (e) { console.error("Email Error:", e); }
  }

  // 2. Send Telegram
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: messageText
        })
      });
      const data = await response.json();
      lastTelegramResponse = data;
      if (response.ok) results.telegram.success = true;
    } catch (e) { console.error("Telegram Error:", e); }
  }

  // 3. Send SMS (Twilio)
  if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const barberPhone = process.env.TWILIO_BARBER_PHONE || '+25193307614';
      await twilioClient.messages.create({
        body: messageText,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: barberPhone
      });
      results.sms.success = true;
    } catch (e) { console.error("SMS Error:", e); }
  }

  res.json({ success: true, results });
});

// Serve static files from the React app
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// For cPanel/Passenger compatibility
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
