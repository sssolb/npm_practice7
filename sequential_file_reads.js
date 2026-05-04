const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/sequential') {
        const t0 = Date.now();

        try {
            const fileA = await fs.readFile(path.join(__dirname, 'a.txt'), 'utf8');
            const fileB = await fs.readFile(path.join(__dirname, 'b.txt'), 'utf8');
            const fileC = await fs.readFile(path.join(__dirname, 'c.txt'), 'utf8');

            const combined = fileA + fileB + fileC;
            const elapsedMs = Date.now() - t0;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ combined, elapsedMs }));
        } catch (error) {
            res.writeHead(500);
            res.end();
        }
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(process.argv[2] || 3000);