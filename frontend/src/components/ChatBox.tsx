import React, { useState } from 'react';
import axios from 'axios';

const SymptomChecker = ({ onSpecialtyFound }) => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/analyze-symptoms', 
        { symptoms }
      );
      
      onSpecialtyFound(response.data.specialty);
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-checker">
      <h3>Describe Your Symptoms</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={symptoms}
          onChange={(e) => {
            setSymptoms(e.target.value);
            setError('');
          }}
          placeholder="Example: I've had chest pain and shortness of breath for 2 days"
          rows={4}
          disabled={loading}
          aria-label="Describe your symptoms"
        />
        
        <button 
          type="submit" 
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : 'Suggest Specialist'}
        </button>
        
        {error && (
          <p className="error" role="alert">
            ⚠️ {error}
          </p>
        )}
        
        {success && (
          <p className="success" role="status">
            ✓ Analysis complete
          </p>
        )}
      </form>
      
      <div className="disclaimer">
        <small>
          <strong>Note:</strong> AI suggestions are preliminary. 
          Always consult with a medical professional for diagnosis.
        </small>
      </div>
    </div>
  );
};

export default SymptomChecker;


