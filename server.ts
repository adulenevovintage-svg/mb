import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from 'resend';
import twilio from 'twilio';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Resend
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  // Initialize Twilio
  const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) 
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
    : null;

  let lastTelegramResponse: any = null;

  // API Route for notifications
  app.post("/api/notify-barber", async (req, res) => {
    const { name, phone, service, date, bookingTime } = req.body;

    // Format date to include day of week
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
⏰ Time: ${bookingTime}
--------------------
    `.trim();

    console.log("--- NEW RESERVATION ---");
    console.log(messageText);
    console.log("-----------------------");

    const results = {
      email: { success: false },
      telegram: { success: false },
      sms: { success: false }
    };

    // 1. Send Email (Resend)
    if (resend) {
      try {
        const recipientEmail = process.env.BARBER_EMAIL || 'amef221412@gmail.com';
        const { data, error } = await resend.emails.send({
          from: 'MB Barber Shop <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: `New Reservation: ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #141414; background-color: #f9f9f9; border-radius: 12px;">
              <h2 style="color: #C5A059; border-bottom: 2px solid #C5A059; padding-bottom: 10px;">New Booking Received</h2>
              <div style="margin-top: 20px;">
                <p><strong>Customer:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service:</strong> <span style="color: #C5A059; font-weight: bold;">${service}</span></p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${bookingTime}</p>
              </div>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">This is an automated notification from your Barber Shop app.</p>
            </div>
          `
        });
        if (!error) results.email.success = true;
      } catch (e) { console.error("Email Error:", e); }
    }

    // 2. Send Telegram
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        console.log("Attempting to send Telegram message...");
        const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: messageText
            // Removed HTML parse mode to avoid issues with special characters
          })
        });
        
        const data = await response.json();
        lastTelegramResponse = data;
        if (response.ok) {
          console.log("Telegram message sent successfully!");
          results.telegram.success = true;
        } else {
          console.error("Telegram API Error:", data);
        }
      } catch (e) { 
        lastTelegramResponse = { error: e instanceof Error ? e.message : String(e) };
        console.error("Telegram Network/Fetch Error:", e); 
      }
    } else {
      console.warn("Telegram configuration missing. Ensure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set in Settings.");
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

    res.json({ 
      success: true, 
      results,
      message: "Notification attempt completed. Check server logs for details."
    });
  });

  // Debug endpoint to check configuration
  app.get("/api/debug-status", (req, res) => {
    res.json({
      telegram: {
        botTokenSet: !!process.env.TELEGRAM_BOT_TOKEN,
        chatIdSet: !!process.env.TELEGRAM_CHAT_ID,
        tokenPreview: process.env.TELEGRAM_BOT_TOKEN ? `${process.env.TELEGRAM_BOT_TOKEN.substring(0, 5)}...` : 'none',
        lastApiResponse: lastTelegramResponse
      },
      email: {
        resendKeySet: !!process.env.RESEND_API_KEY
      },
      sms: {
        twilioSidSet: !!process.env.TWILIO_ACCOUNT_SID,
        twilioTokenSet: !!process.env.TWILIO_AUTH_TOKEN
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("--- Notification Status ---");
    console.log(`📧 Resend Email: ${process.env.RESEND_API_KEY ? 'ENABLED' : 'DISABLED'}`);
    console.log(`🤖 Telegram Bot: ${process.env.TELEGRAM_BOT_TOKEN ? 'ENABLED' : 'DISABLED'}`);
    if (process.env.TELEGRAM_BOT_TOKEN) {
      console.log(`   - Token starts with: ${process.env.TELEGRAM_BOT_TOKEN.substring(0, 4)}...`);
      console.log(`   - Chat ID: ${process.env.TELEGRAM_CHAT_ID || 'MISSING'}`);
    }
    console.log(`📱 Twilio SMS: ${process.env.TWILIO_ACCOUNT_SID ? 'ENABLED' : 'DISABLED'}`);
    console.log("---------------------------");
  });
}

startServer();
