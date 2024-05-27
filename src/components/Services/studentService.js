const API_URL = process.env.REACT_APP_API_URL;

export const uploadResume = async (token, formData) => {
    const config = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    };
    
    try {
      const response = await fetch(`${API_URL}/api/upload-resume`, config);
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
      const response = await fetch(`${API_URL}/api/feedback`, config);
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
  export const fetchAlumniDetails = async (alumniId, token) => {
    try {
      const response = await fetch(`${API_URL}/api/alumni/${alumniId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const alumniDetails = await response.json();
        return alumniDetails;
      } else {
        throw new Error('Failed to fetch alumni details');
      }
    } catch (error) {
      console.error('Error fetching alumni details:', error);
      throw error;
    }
  };