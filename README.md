# CV Shortlisting Platform

An intelligent platform that analyzes CVs against job descriptions to help streamline the recruitment process. The system uses advanced NLP and machine learning techniques to provide detailed matching information.

## Features

- 📄 PDF CV parsing and analysis
- 🔍 Job description matching
- 🎯 Skill extraction and matching
- 📊 Experience level detection
- 🎓 Education qualification analysis
- 💯 Overall match score calculation
- 🎨 Modern, responsive UI
- 🌐 Cloud deployment ready

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Axios for API calls
- React Dropzone for file uploads
- Deployed on Vercel

### Backend
- FastAPI (Python)
- spaCy for NLP
- Sentence Transformers for text embeddings
- PyPDF2 for PDF processing
- Deployed on Render

## Prerequisites

- Python 3.9+
- Node.js 14+
- npm or yarn

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

4. Start the backend server:
```bash
python app/main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Name: `shortlist-cv`
   - Environment: `Python`
   - Build Command: (from render.yaml)
   - Start Command: (from render.yaml)

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`

## API Endpoints

### POST /api/analyze
Analyzes a CV against a job description.

**Request:**
- `cv`: PDF file (multipart/form-data)
- `jd`: Job description text (form-data)

**Response:**
```json
{
  "score": 85.5,
  "matching_skills": ["python", "react", "aws"],
  "missing_skills": ["kubernetes", "docker"],
  "experience": [
    {
      "years": "5",
      "context": "5 years of experience in software development"
    }
  ],
  "education": [
    {
      "degree": "bachelor",
      "text": "Bachelor's degree in Computer Science"
    }
  ]
}
```

## Project Structure

```
Shortlist-CV/
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── requirements.txt
│   ├── render.yaml
│   └── venv/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   └── ...
│   ├── package.json
│   └── vercel.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [spaCy](https://spacy.io/)
- [Sentence Transformers](https://www.sbert.net/)
- [Material-UI](https://mui.com/)
- [React](https://reactjs.org/)