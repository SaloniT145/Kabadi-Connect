# Kabadi-Connect
SIH Project - Connecting Waste Collectors to Formal Recycling Chain
<<<<<<< HEAD
=======
# Kabadi-Connect
SIH Project - Connecting Waste Collectors to Formal Recycling Chain
>>>>>>> 7c7d0d096bc7fdbdc2f576b6f6688e207040e6af

A simple Android application that connects informal e-waste collectors (kabadiwalas) with authorized recyclers.

The application helps collectors:
- Identify e-waste using a photo
- Get an estimated material value
- View basic price information
- Find suitable authorized recyclers
- Record e-waste transactions
- Maintain an earnings ledger
- Receive safety instructions
- Use the application in Hindi/Marathi through a simple voice-based interface

The system also provides a basic web dashboard for administrators/government authorities to view aggregated transaction analytics.

---

## Project Objective

Build a simple digital bridge between informal e-waste collectors and the formal recycling ecosystem.

The MVP focuses on:

1. Easy e-waste identification
2. Price discovery
3. Authorized recycler discovery
4. Digital transaction records
5. Safety guidance
6. Basic government analytics

The application should be lightweight and suitable for entry-level Android devices.

---

# Technology Stack

## Mobile Application

- Android
- React Native
- JavaScript
- Expo (preferred for simple development)

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## APIs

- REST API
- JSON

## AI

For the MVP, AI-based image classification should be kept simple.

The backend should provide an endpoint for image classification.

Initially, use a simple mock/classification service or a lightweight pre-trained model.

Supported categories:

- PCB
- Battery
- Cable
- CRT
- LCD
- Motor/Magnet Assembly
- Mixed Plastic
- Other

The architecture should allow the AI model to be replaced later without changing the mobile application.

---

# System Architecture

```text
Android App
     |
     | REST API
     v
Node.js + Express Backend
     |
     +------------ MongoDB
     |
     +------------ AI Classification Service
     |
     +------------ Price Data
     |
     +------------ Recycler Data
     |
     +------------ Transaction Data
     |
     v
Admin/Government Dashboard

## MVP starter

This repository now includes a runnable web MVP with the same core flows described above:

- `frontend/`: React + Vite dashboard for collector earnings, material rates, recycler discovery, transactions, and mock e-waste classification.
- `server/`: Express REST API with mock in-memory data and MongoDB-ready environment configuration.

### Run locally

```bash
npm install
cd server && npm install
cd ../frontend && npm install
cd ..
npm run dev
```

The dashboard runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

The classification endpoint is intentionally mocked for the MVP. Replace `POST /api/classify` with a model service later without changing the frontend contract.