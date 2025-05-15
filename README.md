# CV Shortlisting Platform

A secure and private CV shortlisting platform that uses private LLMs and MCPs for automated CV analysis and job description matching.

## Features

- Secure PDF CV parsing
- Private LLM-based text processing
- Vector-based similarity matching
- Scoring system (0-100)
- Privacy-focused architecture
- Modern web interface

## Tech Stack

### Backend
- FastAPI (Python)
- Private LLM Integration
- PDF Processing
- Vector Database
- Secure File Handling

### Frontend
- React
- TypeScript
- Material-UI
- Axios

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Backend Setup
1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the backend:
```bash
uvicorn main:app --reload
```

### Frontend Setup
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Run the frontend:
```bash
npm run dev
```

## Security Features

- All CV processing is done locally
- No third-party API calls for sensitive data
- Secure file handling and storage
- Private LLM integration
- End-to-end encryption for data in transit

## License

MIT License

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.