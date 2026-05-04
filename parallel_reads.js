const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/parallel') {
        const t0 = Date.now();

        try {
            const files = [
                fs.readFile(path.join(__dirname, 'a.txt'), 'utf8'),
                fs.readFile(path.join(__dirname, 'b.txt'), 'utf8'),
                fs.readFile(path.join(__dirname, 'c.txt'), 'utf8')
            ];

            const results = await Promise.all(files);
            const combined = results.join('');
            const elapsedMs = Date.now() - t0;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ combined, elapsedMs }));
        } catch (err) {
            res.writeHead(500);
            res.end();
        }
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(process.argv[2] || 3000);