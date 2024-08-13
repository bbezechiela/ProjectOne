import http from 'http';
import url, { URL } from 'url';
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
        connectionLimit: 20,
        host: 'sql12.freemysqlhosting.net',
        user: 'sql12725759',
        password: 'utukQHSN5y',
        database: 'sql12725759', 
        port: 3306,
    });

    // form data (sign up)
    if (request.url === '/demonode') {
        let data = {};
        request.on('data', (dataChunks) => {
            const jsonParsed = JSON.parse(dataChunks.toString());
            data = jsonParsed;
        }); 

        request.on('end', () => {
            // console.log(data);
            response.end(JSON.stringify({ message: "Data received successfully" }));
            
            if (Object.keys(data).length !== 0) {
                const checker = `SELECT id FROM users WHERE uid = '${data.uid}'`;
                const insertQuery = `INSERT INTO users (uid, display_name, email, profile_path) VALUES ('${data.uid}', "${data.displayName}", '${data.email}', '${data.profile_path}')`;
                pool.query(checker, (err, result) => {
                    if (result.length === 0) {
                        pool.query(insertQuery, (err) => {
                            console.log(err);
                            console.log('inserted successfully');
                        });
                    }
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
            // console.log('search data chunks', dataChunks);
            data = parsedData;
            // console.log('showing search data', parsedData);
        });

        request.on('end', () => {
            pool.query = util.promisify(pool.query).bind(pool);
            // console.log(data);
            if (Object.keys(data).length !== 0) {
                // console.log(data);
                const searchQuery = `SELECT * FROM users WHERE display_name = "${data.getSearchValue.searchValue}"`;

                (async () => {
                    const firstQuery = await pool.query(searchQuery).then(result => { return result });

                    const secondQuery = firstQuery.map((element) => {
                        return pool.query(`SELECT * FROM user_request WHERE (request_receiver = '${element.uid}' AND request_sender = '${data.currentUser[0].uid}' OR request_receiver = '${data.currentUser[0].uid}' AND request_sender = '${element.uid}') AND request_status = 'accepted'`);
                    });

                    let result = await Promise.all(secondQuery);
                    // console.log('first query result', firstQuery);
                    result = result.flatMap((element) => { return element });
                    
                    result.length !== 0 ? result[0].display_name = firstQuery[0].display_name : result = firstQuery;

                    firstQuery.length !== 0 ? response.end(JSON.stringify({data: result})) : response.end(JSON.stringify({data: [{display_name: 'Cant find any user'}]}));
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
            console.log(data);
            if (Object.keys(data).length !== 0) {
                const requestQuery = `INSERT INTO user_request (request_sender, request_receiver, request_status, timestamp) 
                VALUES ('${data.currentUser[0].uid}', '${data.e.uid}', 'pending', '${currentDate}')`;
                
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
            console.log('get requests', data);
            // console.log('get requests parsed data', data);
            if (Object.keys(data).length !== 0) {
                const requestSenderId = `SELECT request_id, request_sender FROM user_request WHERE request_receiver = '${data.currentUser}' AND request_status = 'pending'`;

                (async () => {
                    const firstQuery = await pool.query(requestSenderId).then((result) => { 
                            console.log(result);
                            return result; 
                        });

                    const secondQuery = firstQuery.map((element) => {
                        return pool.query(`SELECT * FROM users WHERE uid = '${element.request_sender}'`)
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
            console.log('PARSED DATAAAAA', data);
            const getFriendsQuery = `SELECT request_id, request_sender, request_receiver FROM user_request WHERE (request_receiver = '${data.currentUser}' OR request_sender = '${data.currentUser}') AND request_status = 'accepted'`;
            if (Object.keys(data).length !== 0) {
                (async () => {
                    const firstQuery = await pool.query(getFriendsQuery)
                        .then((result) => { return result });
                        
                    const secondQuery = firstQuery.map((e) => {
                        let temp; 
                        e.request_sender === data.currentUser ? temp = e.request_receiver : temp = e.request_sender;
                        return pool.query(`SELECT * FROM users WHERE uid = '${temp}'`);
                    });

                    // console.log('VALUES FROM FIRST QUERY', firstQuery);

                    const allQuery = await Promise.all(secondQuery);
                    const requestData = allQuery.flatMap((result) => { return result; });
                    for (let i in firstQuery) {
                        requestData[i].request_id = firstQuery[i].request_id;
                        requestData[i].request_sender = firstQuery[i].request_sender;
                    }

                    console.log(requestData);
                    response.end(JSON.stringify({result: requestData}));
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
                let conversation_name = [data.currentUser.display_name.replace(' ', '_'), data.getMessageReceiver.display_name.replace(' ', '_')].sort();
                conversation_name = `${conversation_name[0]}-${conversation_name[1]}`;

                const conversationChecker = `SELECT conversation_id FROM conversation_container WHERE conversation_name = "${conversation_name}"`;
                const createConversation = `INSERT INTO conversation_container (conversation_name, conversation_timestamp) VALUES ("${conversation_name}", '${currentDate}')`;

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

                    checker.map((element) => {
                        pool.query(`INSERT INTO conversation_messages (message_content, message_sender, message_receiver, conversation_id, message_timestamp) VALUES ('${data.getMessageContent.messageContent}', '${data.currentUser.uid}', '${data.getMessageReceiver.uid}', ${element.conversation_id}, '${currentDate}')`);
                    })

                    response.end(JSON.stringify({message: 'success'}));
                })();
            } else {
                response.end(JSON.stringify({error: 'theres no object keys'}));
            }
        });
    }

    // select conversation
    if (request.url === '/conversation') {
        let data = {};        
        request.on('data', (dataChunks) => {
            const parsedData = JSON.parse(dataChunks.toString());
            data = parsedData;
        }); 
        
        request.on('end', () => {
            pool.query = util.promisify(pool.query).bind(pool);
            if (Object.keys(data).length !== 0) {
                // console.log(data);
                let conversation_name = [data.currentUser.display_name.replace(' ', '_'), data.messageReceiver.display_name.replace(' ', '_')].sort();
                conversation_name = `${conversation_name[0]}-${conversation_name[1]}`;
                // console.log(conversation_name);

                (async () => {
                    const checker = await pool.query(`SELECT * FROM conversation_container WHERE conversation_name = "${conversation_name}"`).then((result) => { return result });

                    let getter = checker.map((element) => {
                        return pool.query(`SELECT * FROM conversation_messages WHERE conversation_id = ${element.conversation_id}`);
                    });

                    getter = await Promise.all(getter);
                    getter = getter.flatMap((result) => { return result });

                    console.log('checker data', checker);
                    const demo = getter[0].message_timestamp;
                    // console.log('getter data', typeof demo);

                    response.end(JSON.stringify({message: [checker, getter]}));
                })();
            } else {
                response.end(JSON.stringify({message: 'conversation error'}));
            }
        });
    } 
    
    // panginano 
    const getMethodUrl = new URL(request.url, 'https://justforabe.onrender.com');
    const path = getMethodUrl.pathname;
    // gettingmessagespertick
    if (path == '/getMessagesPerTick') {
        const lastMessageTimestamp = getMethodUrl.searchParams.get('lastMessageTimestamp');
        const conversation_id = getMethodUrl.searchParams.get('conversation_id');

        const getter = `SELECT * FROM conversation_messages WHERE message_timestamp > '${lastMessageTimestamp}' AND conversation_id = ${conversation_id}`;

        pool.query(getter, (err, result) => {
            // console.log(err);
            if (result.length !== 0) {
                response.end(JSON.stringify({message: result}));
            } else {
                response.end(JSON.stringify({message: []}));
            }
        });
    } 
});

server.listen(10000, '0.0.0.0', () => console.log('connected to server'));