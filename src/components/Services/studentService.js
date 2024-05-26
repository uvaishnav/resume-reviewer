const API_URL = 'http://localhost:9000/api'

export const uploadResume = async (token, formData) => {
    const config = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    };
    
    try {
      const response = await fetch(`${API_URL}/upload-resume`, config);
      console.log(response.status)
      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  };
  
  export const getFeedback = async (token) => {
    const config = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    try {
      const response = await fetch(`${API_URL}/feedback`, config);
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  };
  