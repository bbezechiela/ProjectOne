import { log } from 'console';
import http from 'http';
import mysql from 'mysql';

const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'happyme123',
        database: 'nodejsdb', 
    });

    conn.connect((err) => {
        if (err) throw err;
        console.log('connected to mysql');
    });

    // form data
    if (request.url === '/demonode') {
        let data = {};
        request.on('data', (dataChunks) => {
            const jsonParsed = JSON.parse(dataChunks.toString());

            data = { ...data, ...jsonParsed};
        }); 

        request.on('end', () => {
            console.log(typeof data);
            console.log(data);
            response.end(JSON.stringify({ message: "Data received successfully" }));

            if (Object.keys(data).length !== 0) {
                const insertQuery = `INSERT INTO demoTable (username, email, password) VALUES ('${data.username}', '${data.email}', '${data.password}')`;
                conn.query(insertQuery, () => {
                    console.log('inserted successfully');
                });
            } 
        });

        console.log('calling data object outside the on and end events', data);

    } else {
        console.log('error');
    }

});

server.listen(2020, () => console.log('connected to server'));