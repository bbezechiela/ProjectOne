import { log } from 'console';
import http from 'http';
import mysql from 'mysql';

const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // mysql connection
    const conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'happyme123',
        database: 'nodejsdb', 
    });

    conn.connect((err) => {
        if (err) throw err;
    });

    // form data (sign up)
    if (request.url === '/demonode') {
        let data = {};
        request.on('data', (dataChunks) => {
            const jsonParsed = JSON.parse(dataChunks.toString());
            data = jsonParsed;
        }); 

        request.on('end', () => {
            console.log(typeof data);
            console.log(data);
            response.end(JSON.stringify({ message: "Data received successfully" }));

            if (Object.keys(data).length !== 0) {
                const insertQuery = `INSERT INTO users (username, email, password) VALUES ('${data.username}', '${data.email}', '${data.password}')`;
                conn.query(insertQuery, () => {
                    console.log('inserted successfully');
                });
            } 
        });

        console.log('calling data object outside the on and end events', data);

    } 

    // form data (login)
    if (request.url === '/getCredentials') {
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        });

        request.on('end', () => {
            try {
                if (Object.keys(data).length > 0) {
                    const selectQuery = `SELECT * FROM users WHERE email = '${data.email}' AND password = '${data.password}'`;

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
    } 

    // search feature
    if (request.url === '/search') {
        let searchData = {searchValue: ''};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            console.log('search data chunks', dataChunks);
            searchData = parsedData;
            console.log('showing search data', parsedData);
        });

        request.on('end', () => {
            console.log(searchData.searchValue);
            if (Object.keys(searchData).length !== 0) {
                const searchQuery = `SELECT * FROM users WHERE username = '${searchData.searchValue}'`;
                conn.query(searchQuery, (err, result) => {
                    if (result.length > 0) {
                        console.log('first element returned', result[0]);
                        console.log(result);
                        response.end(JSON.stringify({data: result}));
                    } else {
                        // ig username nalat key, kay anu? observe nala ha search tsx
                        response.end(JSON.stringify({error: [{username: 'Cant find any user'}]}));
                        console.log('cant find anything');
                    }
                });
            } else {
                console.log('empty search input field');
            }
        });
    } 

    // user friend request 
    if (request.url === '/sendRequest') {
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            // console.log('friend request data chunks', dataChunks);
            data = parsedData;
        });

        request.on('end', () => {
            if (Object.keys(data).length !== 0) {
                const requestQuery = `INSERT INTO user_request (request_sender, request_receiver, request_status) 
                VALUES (${data.getCurrentUser.id}, ${data.e.id}, 'pending')`;
                
                conn.query(requestQuery, (err, result) => {
                    response.end(JSON.stringify({message: 'Friend Request Sent'}));
                    console.log('REQUEST SUCCESSFULLY SENT');
                });
            } else {
                console.log('no properties an the object');
                response.end(JSON.stringify({message: 'sent request failed'}));
            }
        });
    }

    // get requests
    if (request.url === '/getRequests') {
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        });

        request.on('end', () => {
            if (Object.keys(data).length !== 0) {
                const requestSenderId = `SELECT request_id, request_sender FROM user_request WHERE request_receiver = ${data.id} AND request_status = 'pending'`;
                let resultOne = [];
                let resultTwo = [];
                conn.query(requestSenderId, (err, result) => {
                    if (err) throw err;
                    for (let i in result) {
                        resultOne.push(result[i]);
                        conn.query(`SELECT * FROM users WHERE id = ${result[i].request_sender}`, (err, result) => {
                            for (let j in result) {
                                resultTwo.push(result[j]);
                            }
                            response.end(JSON.stringify({
                                message: [{
                                    resultOne: resultOne,
                                    resultTwo: resultTwo,
                                }]
                            }));
                            // console.log('result one container', resultOne);
                            // console.log('result two container', resultTwo);
                        });
                    }

                });
            } else {
                console.log('object empty');
                response.end(JSON.stringify({message: 'get request failed'}));
            }
        });
    }
});

server.listen(2020, () => console.log('connected to server'));