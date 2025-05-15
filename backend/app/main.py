from fastapi import FastAPI, UploadFile, File, Form # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
import PyPDF2 # type: ignore
import spacy # type: ignore
from sentence_transformers import SentenceTransformer # type: ignore
import numpy as np # type: ignore
from typing import Optional, List, Dict
import os
import tempfile
import re

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://shortlist-cv.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize spaCy
nlp = spacy.load("en_core_web_sm")

# Initialize sentence transformer
model = SentenceTransformer('all-MiniLM-L6-v2')

# Common skills and keywords
SKILLS = [
    "python", "java", "javascript", "typescript", "react", "angular", "vue",
    "node.js", "express", "django", "flask", "fastapi", "sql", "nosql",
    "mongodb", "postgresql", "mysql", "aws", "azure", "gcp", "docker",
    "kubernetes", "ci/cd", "git", "agile", "scrum", "machine learning",
    "ai", "data science", "big data", "analytics", "devops", "cloud",
    "microservices", "rest api", "graphql", "testing", "security"
]

def extract_text_from_pdf(pdf_file):
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(pdf_file.read())
        temp_file_path = temp_file.name

    text = ""
    with open(temp_file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()

    os.unlink(temp_file_path)
    return text

def preprocess_text(text):
    doc = nlp(text.lower())
    # Remove stop words and punctuation
    tokens = [token.text for token in doc if not token.is_stop and not token.is_punct]
    return " ".join(tokens)

def extract_skills(text: str) -> List[str]:
    text_lower = text.lower()
    found_skills = []
    for skill in SKILLS:
        if skill in text_lower:
            found_skills.append(skill)
    return found_skills

def extract_experience(text: str) -> List[Dict[str, str]]:
    # Look for experience patterns like "X years of experience" or "X+ years"
    experience_patterns = [
        r'(\d+)\+?\s*years?\s*(?:of)?\s*experience',
        r'experience\s*(?:of)?\s*(\d+)\+?\s*years?'
    ]
    
    experiences = []
    for pattern in experience_patterns:
        matches = re.finditer(pattern, text.lower())
        for match in matches:
            years = match.group(1)
            context = text[max(0, match.start()-50):min(len(text), match.end()+50)]
            experiences.append({
                "years": years,
                "context": context.strip()
            })
    return experiences

def extract_education(text: str) -> List[Dict[str, str]]:
    education_keywords = ["bachelor", "master", "phd", "degree", "university", "college"]
    education_sections = []
    
    # Split text into sentences
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    
    for sentence in sentences:
        if any(keyword in sentence.lower() for keyword in education_keywords):
            education_sections.append({
                "text": sentence.strip(),
                "degree": next((keyword for keyword in education_keywords if keyword in sentence.lower()), "other")
            })
    
    return education_sections

def calculate_similarity(text1, text2):
    # Encode the texts
    embedding1 = model.encode(text1)
    embedding2 = model.encode(text2)
    
    # Calculate cosine similarity
    similarity = np.dot(embedding1, embedding2) / (np.linalg.norm(embedding1) * np.linalg.norm(embedding2))
    return float(similarity)  # Convert numpy float32 to Python float

@app.post("/api/analyze")
async def analyze_cv_jd(
    cv: UploadFile = File(...),
    jd: str = Form(...)
):
    # Extract text from CV
    cv_text = extract_text_from_pdf(cv.file)
    
    # Preprocess both CV and JD
    processed_cv = preprocess_text(cv_text)
    processed_jd = preprocess_text(jd)
    
    # Calculate similarity score
    similarity_score = calculate_similarity(processed_cv, processed_jd) * 100
    
    # Extract detailed information
    cv_skills = extract_skills(cv_text)
    jd_skills = extract_skills(jd)
    matching_skills = list(set(cv_skills) & set(jd_skills))
    missing_skills = list(set(jd_skills) - set(cv_skills))
    
    experience = extract_experience(cv_text)
    education = extract_education(cv_text)
    
    return {
        "score": round(similarity_score, 2),
        "cv_text": cv_text,
        "jd_text": jd,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "experience": experience,
        "education": education
    }

if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run(app, host="0.0.0.0", port=8000) 