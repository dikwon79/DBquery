const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        fs.readFile('./index.html', 'utf8', (err, page) => {
            if (err) {
                res.writeHead(404);
                res.end('Error: File Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(page);
            }
        });
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(body); // log the request body

            // Here you can handle the POST request, for example, parse the body and insert the data into a database
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data received' }));
        });
    } else {
        // If the method is neither GET nor POST
        res.writeHead(405);
        res.end('Method Not Allowed');
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
