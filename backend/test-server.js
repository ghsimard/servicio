const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Server is running!' }));
});

const PORT = 3002;

server.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server');
  server.close(() => {
    process.exit(0);
  });
}); 