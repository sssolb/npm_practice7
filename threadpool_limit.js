const http = require('http');
const crypto = require('crypto');
const { promisify } = require('util');

const pbkdf2 = promisify(crypto.pbkdf2);

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/threadpool-limit') {
        const t0 = Date.now();
        const tasks = 8;
        
        try {
            const promises = [];
            for (let i = 0; i < tasks; i++) {
                promises.push(pbkdf2('password', 'salt', 100000, 64, 'sha512'));
            }

            await Promise.all(promises);
            const durationMs = Date.now() - t0;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ tasks, durationMs }));
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