const API_URL = 'http://localhost:9000/api'

export const getResumes = async (token) => {
    const response = await fetch(`${API_URL}/resumes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const data = await response.json();
    return data;
  };
  
  export const submitFeedback = async (token, feedbackData) => {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedbackData)
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const data = await response.json();
    return data;
  };
  