import { log } from 'console';
import http from 'http';
import mysql, { createPool } from 'mysql';
import util from 'util';

const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // currentDate
    const date = new Date();
    let year = date.toLocaleString('default' , { year: 'numeric' });
    let month = date.toLocaleString('default', { month: '2-digit' });
    let day = date.toLocaleString('default', { day: '2-digit' });

    const currentDate = `${year}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    // mysql connection
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'happyme123',
        database: 'nodejsdb', 
    });

    // form data (sign up)
    if (request.url === '/demonode') {
        let data = {};
        request.on('data', (dataChunks) => {
            const jsonParsed = JSON.parse(dataChunks.toString());
            data = jsonParsed;
        }); 

        request.on('end', () => {
            response.end(JSON.stringify({ message: "Data received successfully" }));
            
            if (Object.keys(data).length !== 0) {
                const insertQuery = `INSERT INTO users (username, email, password) VALUES ('${data.username}', '${data.email}', '${data.password}')`;
                pool.query(insertQuery, () => {
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

                    pool.query(selectQuery, (err, result) => {
                        result.length !== 0 ? response.end(JSON.stringify({result: result})): response.end(JSON.stringify({error: 'user does not exist'}));
                    });
                } else {
                    response.end(JSON.stringify({error: 'Cant find any user'}));
                }
            } catch (error) {
                console.log(error);
            }
        });
    } 

    // search feature
    if (request.url === '/search') {
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            console.log('search data chunks', dataChunks);
            data = parsedData;
            // console.log('showing search data', parsedData);
        });

        request.on('end', () => {
            pool.query = util.promisify(pool.query).bind(pool);
            // console.log(data);
            if (Object.keys(data).length !== 0) {
                const searchQuery = `SELECT * FROM users WHERE username = '${data.getSearchValue.searchValue}'`;
                (async () => {
                    const firstQuery = await pool.query(searchQuery).then(result => { return result });

                    const secondQuery = firstQuery.map((element) => {
                        return pool.query(`SELECT * FROM user_request WHERE (request_receiver = ${element.id} AND request_sender = ${data.getCurrentUser.id} OR request_receiver = ${data.getCurrentUser.id} AND request_sender = ${element.id}) AND request_status = 'accepted'`);
                    });

                    let result = await Promise.all(secondQuery);
                    // console.log('first query result', firstQuery);
                    result = result.flatMap((element) => { return element });
                    
                    result.length !== 0 ? result[0].username = firstQuery[0].username : result = firstQuery;

                    firstQuery.length !== 0 ? response.end(JSON.stringify({data: result})) : response.end(JSON.stringify({data: [{username: 'Cant find any user'}]}));
                })();
            } else {
                console.log('empty search input field');
                response.end(JSON.stringify({error: 'error po'}));
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
                
                pool.query(requestQuery, (err, result) => {
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
        pool.query = util.promisify(pool.query).bind(pool);
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        });
        request.on('end', () => {
            // console.log('get requests parsed data', data);
            if (Object.keys(data).length !== 0) {
                const requestSenderId = `SELECT request_id, request_sender FROM user_request WHERE request_receiver = ${data.id} AND request_status = 'pending'`;

                (async () => {
                    const firstQuery = await pool.query(requestSenderId)
                        .then((result) => { 
                            console.log(result);
                            return result; 
                        });

                    const secondQuery = firstQuery.map((e) => {
                        return pool.query(`SELECT * FROM users WHERE id = ${e.request_sender}`)
                    });

                    const allQuery = await Promise.all(secondQuery);
                    const requestData = allQuery.flatMap((result) => result);
                    for (let i in firstQuery) {
                        requestData[i].request_sender = firstQuery[i].request_sender;
                        requestData[i].request_id = firstQuery[i].request_id;
                    }

                    return response.end(JSON.stringify({
                            result: requestData,
                    }));
                })();
            } else {
                console.log('object empty');
                response.end(JSON.stringify({message: 'get request failed'}));
            }
        });
    }
    
    // accept request
    if (request.url === '/acceptRequest') {
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            console.log(dataChunks);
            data = parsedData;
        }) 

        request.on('end', () => {
            // console.log(data);
            const acceptRequestQuery = `UPDATE user_request SET request_status = 'accepted' WHERE request_id = ${data.request_id}`;
            if (Object.keys(data).length !== 0) {
                pool.query(acceptRequestQuery, (err, result) => {
                    response.end(JSON.stringify({message: 'updated successfully'}));
                });
            } else {
                response.end(JSON.stringify({error: 'failed to update'}));
            }
        });
    }

    // decline request
    if (request.url === '/declineRequest') {
        let data = {};        
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        });

        request.on('end', () => {
            const declineQuery = `UPDATE user_request SET request_status = 'declined' WHERE request_id = ${data.request_id}`;
            if (Object.keys(data).length !== 0) {
                pool.query(declineQuery, (err, result) => {
                    response.end(JSON.stringify({success: 'Request Declined Successfully'}));
                })
            } else {
                response.end(JSON.stringify({failed: 'failed to decline'}));
            }
        });
    }

    // get friends
    if (request.url === '/getFriends') {
        pool.query = util.promisify(pool.query).bind(pool);
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        });

        request.on('end', () => {
            // console.log('PARSED DATAAAAA', data);
            const getFriendsQuery = `SELECT request_id, request_sender, request_receiver FROM user_request WHERE (request_receiver = ${data.id} OR request_sender = ${data.id}) AND request_status = 'accepted'`;
            if (Object.keys(data).length !== 0) {
                (async () => {
                    const firstQuery = await pool.query(getFriendsQuery)
                        .then((result) => { return result });
                        
                    const secondQuery = firstQuery.map((e) => {
                        let temp; 
                        e.request_sender === data.id ? temp = e.request_receiver : temp = e.request_sender;
                        return pool.query(`SELECT * FROM users WHERE id = ${temp}`);
                    });

                    // console.log('VALUES FROM FIRST QUERY', firstQuery);

                    const allQuery = await Promise.all(secondQuery);
                    const requestData = allQuery.flatMap((result) => { return result; });
                    for (let i in firstQuery) {
                        requestData[i].request_id = firstQuery[i].request_id;
                        requestData[i].request_sender = firstQuery[i].request_sender;
                    }

                    // console.log(requestData);
                    response.end(JSON.stringify({
                        result: requestData
                    }));
                })();
            } else {
                console.log('friend list is empty');
                response.end(JSON.stringify({result: 'friend list is empty'}));
            }
        });
    }

    // remove friend
    if (request.url === '/removeFriend') {
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        });

        request.on('end', () => {
            const removeFriendQuery = `DELETE FROM user_request WHERE request_id = ${data.request_id}`;
            if (Object.keys(data).length !== 0) {
                pool.query(removeFriendQuery, (err, result) => {
                    console.log('success han pag remove kan ', data.username, data.request_id);
                    response.end(JSON.stringify({success: `succes an pag remove kan ${data.username}`}));
                });
            } else {
                response.end(JSON.stringify({error: 'failed to remove friend'}));
            }
        });
    }

    // send message
    if (request.url === '/sendMessage') {
        let data = {};
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        });

        request.on('end', () => {
            pool.query = util.promisify(pool.query).bind(pool);
            if (Object.keys(data).length !== 0) {
                let conversation_name = [data.getCurrentUser.username, data.getMessageReceiver.username].sort();
                conversation_name = `'${conversation_name[0]}_${conversation_name[1]}'`;

                const conversationChecker = `SELECT conversation_id FROM conversation_container WHERE conversation_name = ${conversation_name}`;
                const createConversation = `INSERT INTO conversation_container (conversation_name, conversation_timestamp) VALUES (${conversation_name}, '${currentDate}')`;
                const insertQuery = `INSERT INTO conversation_messages (message_content, message_sender, message_receiver, conversation_container, message_timestamp) VALUES ('${data.getMessageContent.messageContent}', ${data.getCurrentUser.id}, ${data.getMessageReceiver.id}, 1, '${currentDate}')`;

                (async () => {
                    const checker = await pool.query(conversationChecker).then((result) => { 
                        if (result.length === 0) {
                            const createConversationResult = pool.query(createConversation).then((result) => {
                                console.log([{conversation_id: result.insertId}]);
                                return [{conversation_id: result.insertId}];
                            });

                            return createConversationResult;
                        } 
                        return result;
                    });

                    const sendMessage = checker.map((element) => {
                        return pool.query(`INSERT INTO conversation_messages (message_content, message_sender, message_receiver, conversation_container, message_timestamp) VALUES ('${data.getMessageContent.messageContent}', ${data.getCurrentUser.id}, ${data.getMessageReceiver.id}, ${element.conversation_id}, '${currentDate}')`);
                    })

                    const allQueries = await Promise.all(sendMessage);
                    console.log('all queries', allQueries);
                    console.log('check data', checker);

                    response.end(JSON.stringify({message: 'success'}));
                    // const setter = checker.map((element) => {
                        // return pool.query(insertQuery);
                    // })
                })();

            } else {
                response.end(JSON.stringify({error: 'theres no object keys'}));
            }
        });
    }

    if (response.url === '/conversation') {
        let data = {};        
        response.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        });

        response.on('end', () => {
            const conversationChecker = 'SELECT conversation_id FROM conversation_container '                
            if (Object.keys(data).length !== 0) {


            } else {
                response.end(JSON.stringify({message: 'conversation error'}));
            }
        });
    }



});

server.listen(2020, () => console.log('connected to server'));