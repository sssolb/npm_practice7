const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/error-handling' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => { body += chunk; });
    
    req.on('end', async () => {
      try {
        const filenames = JSON.parse(body);
        
        if (!Array.isArray(filenames)) {
          res.writeHead(400);
          return res.end();
        }

        const results = await Promise.allSettled(
          filenames.map(file => fs.readFile(path.join(__dirname, file), 'utf8'))
        );

        const successes = [];
        const failures = [];

        results.forEach((result, i) => {
          if (result.status === 'fulfilled') {
            successes.push(result.value);
          } else {
            failures.push(filenames[i]);
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ successes, failures, total: filenames.length }));

      } catch (err) {
        res.writeHead(400);
        res.end();
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(process.argv[2] || 3000);