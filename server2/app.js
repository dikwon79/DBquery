///*we are used chatgpt3.5 to implement these codes and design sites*/
const mysql = require('mysql2');
const http = require('http');
const { URL } = require('url');
const messages = require("./lang/messages/en/user");

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
                console.error(messages.connectError + err.stack);
                return;
            }
            console.log(messages.connected + this.connection.threadId);
            this.createTable();
        });
    }
    
    createTable() {
        this.connection.query(`
            CREATE TABLE IF NOT EXISTS Spatients (
                patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                dateOfBirth DATETIME NOT NULL
            ) ENGINE=InnoDB;
        `, function(err, results, fields) {
            if (err) {
                console.error(messages.createError, err);
            } else {
                console.log(messages.tableSuccess);
            }
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
            console.log(messages.insertSuccess);
        });
    }

    fetchData(sqlQuery, res) {

        if (sqlQuery.toUpperCase().includes('UPDATE') || sqlQuery.toUpperCase().includes('DELETE')) {
            console.error(messages.notAllowed);
            res.writeHead(403, { 'Content-Type': 'text/json' });
            res.end(messages.notAllowed);
            return;
        }
        
        this.connection.query(sqlQuery, function(err, results, fields) {
            if (err) {
                console.error(messages.errorMysql + err.stack);
                res.writeHead(500, { 'Content-Type': 'text/json' });
                res.end(messages.severError);
                return;
            }
            console.log(messages.resultQuery, results);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    }

    disconnect() {
        this.connection.end(function(err) {
            if (err) {
                console.error(messages.closingError + err.stack);
                return;
            }
            console.log(messages.closed);
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
         // Handle GET requests
         if (req.method === 'GET' && pathname.startsWith(messages.endpoint)) {
            

            const sqlIndex = pathname.indexOf('/sql/') + 5; 
            let sqlQuery = decodeURIComponent(pathname.substring(sqlIndex));
            
        
            sqlQuery = sqlQuery.replace(/"/g, '');
            console.log(sqlQuery); 
     
            this.patientDB.fetchData(sqlQuery, res);
            return; 
        }

        // Handle POST requests
        if (req.method === 'POST' && pathname.startsWith(messages.endpoint)) {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const postData = JSON.parse(body);
                    const sqlQuery = postData.query;
                    console.log(messages.sqlExcute, sqlQuery);
                    // Now fetchData is responsible for sending the response
                    this.patientDB.fetchData(sqlQuery, res);
                } catch (err) {
                    console.error(messages.errorParsing, err);
                    if (!res.headersSent) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end(messages.badRequest);
                    }
                }
            });
            return; // Prevent further execution outside this block
        }

        // If none of the above, send 404 Not Found
        if (!res.headersSent) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(messages.notFound);
        }
    }


    listen(port) {
        this.server.listen(port, () => {
            console.log(`${messages.serverRun} ${port}`);
        });
    }
}

const appServer = new AppServer();
appServer.listen(8080);
