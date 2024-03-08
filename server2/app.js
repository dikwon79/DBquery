const mysql = require('mysql2');
const http = require('http');
const { URL } = require('url');

class PatientDatabase {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'db-mysql-nyc3-61584-do-user-15802968-0.c.db.ondigitalocean.com',
            port: 25060,
            user: 'doadmin',
            password: 'AVNS_gJeBLp6MVV_PyMx3baQ',
            database: 'comp4537'
        });
    }

    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL: ' + err.stack);
                return;
            }
            console.log('Connected to MySQL as id ' + this.connection.threadId);
        });
    }

    createTable() {
        this.connection.query(`
            CREATE TABLE patients (
                patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                dateOfBirth DATETIME NOT NULL
            ) ENGINE=InnoDB;
        `, function(err, results, fields) {
            if (err) throw err;
            console.log('patients table created successfully.');
        });
    }

    insertData() {
        this.connection.query(`
            INSERT INTO patients (name, dateOfBirth) VALUES
            ('John Doe', '1901-01-01'),
            ('John Smith', '1941-01-01'),
            ('Jack Ma', '1961-01-30'),
            ('Elon Musk', '1999-01-01')
        `, function(err, results, fields) {
            if (err) throw err;
            console.log('Data inserted successfully.');
        });
    }

    fetchData(sqlQuery, res) {
        this.connection.query(sqlQuery, function(err, results, fields) {
            if (err) {
                console.error('Error querying MySQL: ' + err.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            console.log('Query results: ', results);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    }

    disconnect() {
        this.connection.end(function(err) {
            if (err) {
                console.error('Error closing MySQL connection: ' + err.stack);
                return;
            }
            console.log('MySQL connection closed.');
        });
    }
}

class AppServer {
    constructor() {
        this.server = http.createServer(this.handleRequest.bind(this));
        this.patientDB = new PatientDatabase();
        this.patientDB.connect();
    }

    handleRequest(req, res) {
        const reqUrl = new URL(req.url, `https://${req.headers.host}`);
        const pathname = reqUrl.pathname;

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle OPTIONS method immediately and return
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Handle GET requests
        if (req.method === 'GET' && pathname.startsWith('/lab5/api/v1/sql')) {
            const sqlQuery = decodeURIComponent(reqUrl.searchParams.get('query'));
            this.patientDB.fetchData(sqlQuery, res);
            return; // Ensure no further processing for this request
        }

        // Handle POST requests
        if (req.method === 'POST' && pathname.startsWith('/lab5/api/v1/sql')) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const postData = JSON.parse(body);
                    const sqlQuery = postData.query;
                    console.log("Executing SQL query:", sqlQuery);
                    // Now fetchData is responsible for sending the response
                    this.patientDB.fetchData(sqlQuery, res);
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                    if (!res.headersSent) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end('Bad Request: Error parsing JSON');
                    }
                }
            });
            return; // Prevent further execution outside this block
        }

        // If none of the above, send 404 Not Found
        if (!res.headersSent) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }


    listen(port) {
        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

const appServer = new AppServer();
appServer.listen(8080);
