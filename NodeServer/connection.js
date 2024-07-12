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

    // form data (sign up)
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

    // form data (login)
    if (request.url === '/getCredentials') {
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = { ...data, ...parsedData};
        });

        request.on('end', () => {
            try {
                if (Object.keys(data).length > 0) {
                    const selectQuery = `SELECT * FROM demoTable WHERE email = '${data.email}' AND password = '${data.password}'`;

                    conn.query(selectQuery, (err, result) => {
                        response.end(JSON.stringify(result));
                    });
                } else {
                    response.end('Cant find any user');
                }
            } catch (error) {
                console.log(error);
            }
        });

    } else {
        console.log('error in login');
    }

    // search feature
    if (request.url === '/search') {
        let searchData = {searchValue: ''};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            searchData = parsedData;
        });

        request.on('end', () => {
            console.log(searchData.searchValue);
            if (Object.keys(searchData).length !== 0) {
                const searchQuery = `SELECT * FROM demoTable WHERE username = '${searchData.searchValue}'`;
                conn.query(searchQuery, (err, result) => {
                    console.log(result);
                    response.end(JSON.stringify(result));
                });
            } else {
                console.log('cant find any user');
            }
        });
    } else {
        console.log('search error');
    }
});

server.listen(2020, () => console.log('connected to server'));