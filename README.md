# ContractIQ: Smart Contract Risk Analyzer

A premium full-stack application that uses AI to analyze legal contracts, providing risk scores, summaries, and clause-by-clause breakdowns.

## Features
- 📑 **Multi-format Support**: Upload PDF, DOCX, or TXT files.
- 🧠 **AI Reasoning**: Powered by Gemini 1.5 Flash for deep legal analysis.
- 📊 **Risk Dashboard**: Interactive risk meter and severity-coded clause cards.
- 💡 **Mitigation Advice**: AI suggests how to renegotiate risky terms.
- 🎨 **Premium UI**: Modern dark-mode interface with smooth animations.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Axios.
- **Backend**: FastAPI, PDFPlumber, Python-Docx, Google Generative AI.

## Getting Started

### 1. Prerequisites
- Python 3.8+
- Node.js 18+

### 2. Setup Backend
1. Go to `backend/`
2. Create a `.env` file from the template.
3. Add your `GEMINI_API_KEY` (Get it from [Google AI Studio](https://aistudio.google.com/)).
4. The backend is configured to run on `http://localhost:8000`.

### 3. Setup Frontend
1. Go to `frontend/`
2. Run `npm install` (already done if using this setup).
3. The frontend is configured to run on `http://localhost:5174`.

## Project Structure
- `/backend`: FastAPI server and AI logic.
- `/frontend`: React application and design system.
- `implementation_plan.md`: The original architecture roadmap.
