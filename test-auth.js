// Comprehensive authentication testing script
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const API_URL = 'http://localhost:3005/api';
let authToken = null;
let userId = null;

// Helper function to prompt for input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Helper function for API requests
const apiRequest = async (method, endpoint, data = null, auth = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (auth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers,
    };

    if (data) {
      config.data = data;
    }

    console.log(`\n[REQUEST] ${method.toUpperCase()} ${config.url}`);
    if (data) console.log('Request Data:', data);

    const response = await axios(config);
    
    console.log(`\n[RESPONSE] Status: ${response.status}`);
    console.log('Response Data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error(`\n[ERROR] Status: ${error.response?.status || 'Unknown'}`);
    console.error('Error Message:', error.response?.data || error.message);
    return null;
  }
};

// Test functions
const testRegister = async () => {
  console.log('\n===== TESTING REGISTRATION =====');
  
  const name = await prompt('Enter name: ');
  const email = await prompt('Enter email: ');
  const password = await prompt('Enter password: ');
  
  const result = await apiRequest('post', '/auth/register', {
    name,
    email,
    password
  });
  
  if (result) {
    userId = result.userId;
    console.log('Registration successful!');
  }
};

const testLogin = async () => {
  console.log('\n===== TESTING LOGIN =====');
  
  const email = await prompt('Enter email: ');
  const password = await prompt('Enter password: ');
  
  const result = await apiRequest('post', '/auth/login', {
    email,
    password
  });
  
  if (result && result.accessToken) {
    authToken = result.accessToken;
    userId = result.user?.id || userId;
    console.log('Login successful!');
    console.log('Auth Token:', authToken.substring(0, 20) + '...');
  }
};

const testVerifyEmail = async () => {
  console.log('\n===== TESTING EMAIL VERIFICATION =====');
  
  const token = await prompt('Enter verification token: ');
  
  const result = await apiRequest('get', `/auth/verify?token=${token}`);
  
  if (result) {
    console.log('Email verification successful!');
  }
};

const testProtectedEndpoint = async () => {
  console.log('\n===== TESTING PROTECTED ENDPOINT =====');
  
  if (!authToken) {
    console.log('No authentication token available. Please login first.');
    return;
  }
  
  const endpoint = await prompt('Enter endpoint path (e.g., /dashboard/profile): ');
  
  const result = await apiRequest('get', endpoint, null, true);
  
  if (result) {
    console.log('Protected endpoint request successful!');
  }
};

// Main menu
const showMenu = async () => {
  console.clear();
  console.log('\n===== AUTHENTICATION TEST MENU =====');
  console.log('1. Register new user');
  console.log('2. Login');
  console.log('3. Verify email');
  console.log('4. Test protected endpoint');
  console.log('5. Exit');
  
  console.log('\nCurrent Status:');
  console.log(`Auth Token: ${authToken ? 'Available' : 'Not set'}`);
  console.log(`User ID: ${userId || 'Not set'}`);
  
  const choice = await prompt('\nSelect an option (1-5): ');
  
  switch (choice) {
    case '1':
      await testRegister();
      break;
    case '2':
      await testLogin();
      break;
    case '3':
      await testVerifyEmail();
      break;
    case '4':
      await testProtectedEndpoint();
      break;
    case '5':
      console.log('\nExiting...');
      rl.close();
      return;
    default:
      console.log('\nInvalid choice, please try again.');
  }
  
  await prompt('\nPress Enter to continue...');
  await showMenu();
};

// Start the program
console.log('Authentication Test Utility');
showMenu().catch(err => {
  console.error('An error occurred:', err);
  rl.close();
}); 