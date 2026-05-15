# 📊 PulseBoard

PulseBoard is a modern, real-time polling platform designed for speed, security, and aesthetics. Built for the Poll mannagement, it allows users to create interactive polls, gather responses anonymously or securely, and watch the results stream in live.

## ✨ Features

- **Real-Time Analytics:** Watch votes stream in live with Socket.IO integration.
- **Dynamic Poll Creation:** Add/remove questions and options dynamically. Toggle questions as mandatory or optional.
- **Fingerprint Security:** Prevents duplicate voting on anonymous polls using device fingerprinting.
- **Live Expiry Countdowns:** Polls automatically expire based on the creator's set time.
- **Beautiful UI/UX:** Built with Tailwind CSS v4, supporting both Light and Dark modes with smooth transitions, glassmorphic elements, and gradient typography.
- **Public & Private Results:** Creators control when results are published to the public.
- **Gamification & Export:** Confetti animations on successful votes, QR code sharing, and image export (html2canvas) of the final charts.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TanStack Router, Tailwind CSS v4, Recharts, React Hook Form, Zod.
- **Backend:** Node.js, Express.js 5, MongoDB (Mongoose), Socket.IO.
- **Security:** JWT Authentication, HttpOnly Cookies, FingerprintJS.

## 🔐 Test Credentials (For Judges)

To quickly test the application and view the dashboard and analytics, you can use the following test account:

- **Email:** `test@gmail.com`
- **Password:** `Rajib@123`

## 🚀 How to Run Locally

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd PulseBoard
   ```

2. **Setup Backend:**

   ```bash
   cd server
   npm install
   ```

   - Create a `.env` file in the `server` directory with:
     ```env
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     ACCESS_TOKEN_SECRET=your_access_secret
     ACCESS_TOKEN_EXPIRY=1d
     REFRESH_TOKEN_SECRET=your_refresh_secret
     REFRESH_TOKEN_EXPIRY=10d
     FRONTEND_URL=http://localhost:5173
     ```
   - Run the backend: `npm run dev`

3. **Setup Frontend:**
   ```bash
   cd client
   npm install
   ```

   - Create a `.env` file in the `client` directory with:
     ```env
     VITE_API_URL=http://localhost:3000/api/v1
     ```
   - Run the frontend: `npm run dev`

## 🎨 Highlights

- **Recharts** for beautiful, animated horizontal bar charts.
- **TanStack Router** for fully typesafe, directory-based routing.
- **Tailwind v4** utilizing custom CSS variables for effortless dark mode.

## 🔄 System Architecture & Flow

```mermaid
graph TD
    %% Define Styles
    classDef creator fill:#4f46e5,stroke:#3730a3,stroke-width:2px,color:#fff;
    classDef voter fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef system fill:#334155,stroke:#1e293b,stroke-width:2px,color:#fff;
    classDef live fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    subgraph "Creator Flow"
        C1[Sign Up / Login]:::creator --> C2[Dashboard 'My Polls']:::creator
        C2 --> C3[Create New Poll]:::creator
        C3 --> |Configure settings| C4[Set Expiry & Anonymity]:::creator
        C4 --> C5[Generate Share Link & QR]:::creator
        C5 --> |Share with Audience| V1
    end

    subgraph "Voter Flow"
        V1[Open Link or Scan QR]:::voter --> V2{Is Poll Active & Valid?}:::system
        V2 -- No --> V3[Show Expired / Not Found]:::system
        V2 -- Yes --> V4{Auth Required?}:::system
        
        V4 -- Yes --> V5[Prompt Login]:::voter
        V4 -- No --> V6[Load Poll UI]:::voter
        V5 --> V6
        
        V6 --> V7[Submit Vote]:::voter
        V7 --> |Fingerprint.js Check| Sys1{Duplicate?}:::system
        Sys1 -- Yes --> V8[Block Submission]:::system
        Sys1 -- No --> V9[Save to Database]:::system
        V9 --> V10[Show Confetti! 🎉]:::voter
    end

    subgraph "Real-Time Engine (Socket.IO)"
        V9 --> |Emit 'voteUpdated'| S1[Socket.IO Server]:::live
        S1 --> |Broadcast to Room| S2[Update Creator's Analytics]:::live
        S1 --> |Broadcast to Room| S3[Update Voting Page Live Badge]:::live
        S1 --> |Broadcast to Room| S4[Update Public Results]:::live
    end

    subgraph "Post-Poll Flow"
        S2 --> C6[Creator Views Analytics]:::creator
        C6 --> C7[Export Charts as Image]:::creator
        C6 --> C8[Publish Results to Public]:::creator
        C8 --> V11[Voters View Public Results]:::voter
    end
```

---

_Built with ❤️ for the live Polls_
