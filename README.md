# MB Barber Shop - Full Stack Application

This is a professional, full-stack grooming reservation system built with React, Express, and Firebase.

## 🚀 Features

- **Real-time Reservations:** Powered by Firestore for instant booking synchronization.
- **Multi-Channel Notifications:**
  - **Telegram:** Instant alerts to the barber via a Telegram Bot.
  - **Email:** Professional HTML emails sent via Resend.
  - **SMS:** Mobile notifications powered by Twilio.
- **Modern UI:** Responsive design with smooth animations using `motion`.
- **Deployment Ready:** Configured for Vercel, cPanel, or standard Node.js environments.

## 🛠️ Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory (use `.env.example` as a template) and add your credentials:

```env
# Email (Resend)
RESEND_API_KEY=your_resend_key
BARBER_EMAIL=amef221412@gmail.com

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### 2. Installation & Development
```bash
# Install dependencies
npm install

# Start development server (Frontend + Backend)
npm run dev
```

### 3. Production Build
```bash
# Generate static assets
npm run build

# Start production server
npm start
```

## 📂 Project Structure

- `server.ts`: Main Express backend handling notifications.
- `app.js`: Production-ready entry point for Vercel/cPanel.
- `src/`: React frontend source code.
- `public/`: Static assets (logos, etc.).
- `firestore.rules`: Security configuration for your database.

## 📝 Deployment Notes

- **Vercel:** Automatically uses `vercel.json` and `app.js`.
- **cPanel:** Point your Node.js application to `app.js` and ensure the `dist` folder is generated via `npm run build`.
- **Firebase:** Ensure your `firebase-applet-config.json` is correctly populated with your project details.

---
*Crafted with excellence for MB Grooming.*
