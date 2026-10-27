# AI Mystery Room — Master Investigation Platform

> **"Your imagination creates the mystery. Your intelligence solves it."**

An AI-powered interactive mystery investigation platform built according to the **Master Product & Technical Specification (SDD v1.0.0)**. Users supply any scenario, crime, or mystery premise. Google Gemini transforms it into a logically consistent, 100% solvable fictional case featuring multi-source evidence, suspect alibis, contradictory clues, an interactive evidence board, and a terminal accusation system.

---

## 🌟 Key Features

1. **AI-Powered Canonical Case Engine**:
   - Uses Google Gemini API (`@google/generative-ai`) with structured JSON schema output and prompt injection defense.
   - Generates a single authoritative ground truth (canonical culprit, motives, method, timeline, and cross-referenced clues).
   - Includes automatic procedural fallback for offline/development mode when an API key is not yet supplied.

2. **Strict Zero-Leakage Architecture**:
   - The canonical solution (`culpritId`, `canonicalSolution`, `hiddenSignificance`, `isCulprit`, `privateFacts`) is strictly sealed in MongoDB.
   - Player-facing endpoints receive a sanitized `playerSafeCase`.
   - The canonical solution endpoint (`GET /api/v1/investigations/:investigationId/solution`) returns HTTP 403 Forbidden until a formal indictment is submitted.

3. **Digital Evidence Investigation Workstation**:
   - **Messages**: Fictional WhatsApp-style encrypted chat records with timestamps and participant avatars.
   - **CCTV Logs**: Surveillance camera feeds with glitch/freeze timestamps.
   - **Forensic Reports**: Digital access lock audits, lab technician findings, and physical evidence markings.
   - **Witness Statements**: Sworn depositions with reliability scores.
   - **Crime Scene Photos**: Visual evidence markers and tread impressions.
   - **Sensor Logs**: Turnstile, badge, and motion sensor telemetry.

4. **Tactical Evidence Board & Investigator Notes**:
   - Pin persons of interest and evidence cards.
   - Formulate deductive connection threads between contradictory records.
   - Autosave working case notes directly to the backend.

5. **Terminal Accusation & Resolution Chamber**:
   - Single terminal accusation per case enforced by the backend (duplicate attempts rejected with HTTP 409).
   - Server-side deductive score calculation based on correctness, clues examined, and hints requested.
   - Comprehensive resolution screen revealing the true culprit, canonical method, full timeline, and why innocent suspects were eliminated.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js, Mongoose, JWT, Bcrypt, Helmet, CORS, Zod
- **Database**: MongoDB with automatic in-memory fallback (`mongodb-memory-server`) for zero-config development
- **AI Engine**: Google Gemini (`@google/generative-ai`, configurable model e.g. `gemini-2.5-flash`)
- **Testing**: Vitest, Supertest

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### 2. Environment Configuration
The server includes a `.env` file pre-configured for instant local development:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
JWT_SECRET=ai_mystery_room_super_secure_jwt_secret_key_2026
```
*(If `GEMINI_API_KEY` is left blank, the application automatically activates the built-in procedural generation engine so you can play immediately without waiting for API keys!)*

### 3. Running Locally

#### Run Backend API:
```bash
npm run dev:server
```
*API runs at `http://localhost:5000`*

#### Run Frontend Client:
```bash
npm run dev:client
```
*Web application runs at `http://localhost:5173`*

#### Run Automated Test Suite:
```bash
npm run test:server
```
Runs 8 integration and unit tests, including the critical security test asserting zero culprit or solution leakage in player responses.

---

## 📁 Repository Structure

```text
├── client/
│   ├── src/
│   │   ├── app/ (App layout, Router)
│   │   ├── components/
│   │   │   ├── common/ (LoadingScreen, Modal)
│   │   │   ├── evidence/ (EvidenceCard, EvidenceViewer)
│   │   │   ├── investigation/ (Timeline, EvidenceBoard, AccusationModal)
│   │   │   ├── layout/ (Navbar, Footer)
│   │   │   └── suspects/ (SuspectCard)
│   │   ├── context/ (AuthContext)
│   │   ├── pages/ (Home, CreateMystery, Investigation, Result, History, Login, Register)
│   │   ├── services/ (API client)
│   │   └── styles/ (Detective design tokens, dark theme)
├── server/
│   ├── src/
│   │   ├── ai/ (Prompts, validators, fallback procedural generator)
│   │   ├── config/ (Database with in-memory fallback, env, Gemini)
│   │   ├── controllers/ (Auth, Cases, Investigations, Evidence)
│   │   ├── middleware/ (Auth, Session, Error handling)
│   │   ├── models/ (User, MysteryCase, Evidence, Investigation)
│   │   ├── routes/ (API endpoints)
│   │   ├── services/ (Generation, accusation evaluation)
│   │   └── server.js
│   └── tests/ (Vitest unit and security test suites)
└── IMPLEMENTATION_PLAN.md
```

---

## ⚖️ Legal & Entertainment Disclaimer
All cases, suspects, conversations, forensic reports, and evidence generated by AI Mystery Room are completely fictional and created solely for puzzle, entertainment, and educational reasoning purposes.
