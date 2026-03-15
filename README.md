# 🚀 Space Command: Developer Portfolio

An immersive, space-themed interactive developer portfolio built with a futuristic "Command Center" aesthetic. This project features a full-stack AI communication system that uses Google Gemini to analyze incoming transmissions.

![Portfolio Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🌌 Core Features

- **Full-Stack AI Comms:** The contact form is a "Space Station" powered by **Google Gemini 1.5 Flash**.
  - **AI Analysis:** Every message is analyzed for intent and priority (LOW to CRITICAL).
  - **Themed Feedback:** Users receive a unique, AI-generated space-themed acknowledgment instantly.
- **Immersive UI/UX:** 
  - **Parallax Spaceflight:** Interactive planets and moons that respond to your mouse.
  - **Hyperspace Transitions:** Custom loading sequences using Framer Motion (`motion/react`).
  - **HUD Navigation:** A Head-Up Display bar and Galaxy Map for section navigation.
- **Retro-Futuristic Aesthetic:** Pixel-perfect borders, glowing shadows, and custom Web Audio API sounds.
- **Vercel Ready:** Built-in serverless architecture for one-click deployment.

## 🛠️ Technical Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4 (Custom Utilities)
- **Animations:** Framer Motion (`motion/react`)
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** Google Gemini 1.5 Flash (@google/generative-ai)
- **Email:** Resend API
- **Audio:** Web Audio API (Custom oscillators)

## 🚀 Local Launch Sequence

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd DevPortfolio
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Google Gemini API (Get from https://aistudio.google.com/)
GEMINI_API_KEY="your_gemini_key"

# Resend Email API (Get from https://resend.com/)
RESEND_API_KEY="re_your_resend_key"

# Where you want to receive the portfolio messages
DESTINATION_EMAIL="your-email@example.com"
```

### 3. Start Development
Run the frontend and backend simultaneously:
```bash
# In one terminal (Vite Frontend)
npm run dev

# In another terminal (AI API via Vercel Dev or TSX)
npm run server
```
*Note: For the best local experience, use `npx vercel dev` if you have the Vercel CLI installed.*

## 🛰️ Deployment (Vercel)

This project is optimized for **Vercel Serverless Functions**.

1. Push your code to a GitHub repository.
2. Import the project into **Vercel**.
3. Add your environment variables (`GEMINI_API_KEY`, `RESEND_API_KEY`, `DESTINATION_EMAIL`) in the Vercel Project Settings.
4. Deploy! Vercel will automatically route `/api/transmit` to the serverless function.

## 📂 Project Structure

- `src/components/effects/`: Starfields, Nebulas, and Pixel-art celestial bodies.
- `src/components/sections/`: The main "Space Stations" of the portfolio.
- `api/transmit.ts`: The AI-powered backend handler.
- `src/utils/audio.ts`: Custom Web Audio API sound triggers.

---
**Developed by [Abhishek](https://github.com/rogx1ne)** — *All systems nominal.*
