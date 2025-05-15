import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://shortlist-cv.onrender.com'
  : 'http://localhost:8000';

interface AnalysisResult {
  score: number;
  cv_text: string;
  jd_text: string;
  matching_skills: string[];
  missing_skills: string[];
  experience: Array<{
    years: string;
    context: string;
  }>;
  education: Array<{
    text: string;
    degree: string;
  }>;
}

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setError(null);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      setError('Please provide both a job description and a CV file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('jd', jobDescription);
    formData.append('cv', file);

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError('Error analyzing CV. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          CV Shortlisting Platform
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              margin="normal"
              required
            />

            <Box
              {...getRootProps()}
              sx={{
                mt: 3,
                p: 3,
                border: '2px dashed #ccc',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              }}
            >
              <input {...getInputProps()} />
              {file ? (
                <Typography>{file.name}</Typography>
              ) : (
                <Typography>
                  {isDragActive
                    ? 'Drop the CV file here'
                    : 'Drag and drop a CV file here, or click to select'}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze CV'}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box sx={{ mt: 4 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="h6">Overall Match Score: {result.score}%</Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Matching Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {result.matching_skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Missing Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {result.missing_skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          color="error"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Experience
                    </Typography>
                    <List>
                      {result.experience.map((exp, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={`${exp.years} years of experience`}
                              secondary={exp.context}
                            />
                          </ListItem>
                          {index < result.experience.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Education
                    </Typography>
                    <List>
                      {result.education.map((edu, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={edu.degree.toUpperCase()}
                              secondary={edu.text}
                            />
                          </ListItem>
                          {index < result.education.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App; 