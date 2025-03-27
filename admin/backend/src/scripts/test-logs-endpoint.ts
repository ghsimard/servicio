import fetch from 'node-fetch';

async function main() {
  try {
    const response = await fetch('http://localhost:3003/logs');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 