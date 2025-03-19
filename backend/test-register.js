// Simple script to test the /api/auth/register endpoint
const axios = require('axios');

const testRegister = async () => {
  try {
    console.log('Attempting to register a user...');
    
    const payload = {
      name: 'Test User',
      email: 'test456@example.com',
      password: 'password123'
    };
    
    console.log('Request payload:', payload);
    
    const response = await axios.post(
      'http://localhost:3005/api/auth/register',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Registration successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Registration failed!');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data);
    console.error('Request config:', error.config);
  }
};

testRegister(); 