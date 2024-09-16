// LFG
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import util from 'util';
const app = express();

const conn = mysql.createConnection({
    // host: 'sql12.freemysqlhosting.net',
    // user: 'sql12725759',
    // password: 'utukQHSN5y',
    // database: 'sql12725759', 
    // port: 3306, 
    host: 'localhost',
    user: 'root',
    password: 'happyme123',
    database: 'nodejsdb',
    port: 3306,
});

conn.connect((err) => {
    if (err) throw err;
    console.log('db connected');
});

const getDate = () => {
    const date = new Date();
    let year = date.toLocaleString('default' , { year: 'numeric' });
    let month = date.toLocaleString('default', { month: '2-digit' });
    let day = date.toLocaleString('default', { day: '2-digit' });

    const currentDate = `${year}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    
    return currentDate; 
}

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:10000');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    next();    
});

app.use(bodyParser.json());

app.post('/demonode', (req) => {
    const { uid, displayName, email, profile_path } = req.body;
    conn.query(`SELECT id FROM users WHERE uid = '${uid}'`, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            conn.query(`INSERT INTO users (uid, displayName, email, profile_path) VALUES ('${uid}', '${displayName}', '${email}', '${profile_path}')`, (err, result) => {
                if (err) throw err;
                console.log('new user inserted successfully');
            })
        }
    });
});

app.post('/search', (req, res) => {
    const { getSearchValue, currentUser } = req.body;

    conn.query(`SELECT * FROM users WHERE display_name = "${getSearchValue.searchValue}"`, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
            let resultOne = result;
            conn.query(`SELECT * FROM user_request WHERE (request_receiver = '${result[0].uid}' AND request_sender = '${currentUser[0].uid}' OR request_receiver = '${currentUser[0].uid}' AND request_sender = '${result[0].uid}') AND request_status = 'accepted'`, (err, result) => {
                if (err) throw err; 
                result.length !== 0 ? result[0].display_name = resultOne[0].display_name : result = resultOne;
                
                resultOne.length !== 0 && res.json({data: result})
            });
        } else {
            res.json({data: [{display_name: 'Cant find any user'}]});
        }
    });
});

app.post('/sendRequest', (req, res) => {
    let { requestReceiver, currentUser } = req.body;

    conn.query(`INSERT INTO user_request (request_sender, request_receiver, request_status, timestamp) VALUES ('${currentUser[0].uid}', '${requestReceiver.uid}', 'pending', '${getDate()}')`, (err) => {
        if (err) throw err;
        res.json({message: 'Friend request sent'});
    });
});

app.get('/getRequests', (req, res) => {
    conn.query = util.promisify(conn.query); 
    let currentUser = req.query.current_user;
    
    (async () => {
        const firstQuery = await conn.query(`SELECT request_id, request_sender FROM user_request WHERE request_receiver = '${currentUser}' AND request_status = 'pending'`).then((result) => { return result });

        const secondQuery = firstQuery.map((item) => {
            return conn.query(`SELECT * FROM users WHERE uid = '${item.request_sender}'`);
        });

        let result = await Promise.all(secondQuery);
        result = result.flatMap((item) => { return item });
        for (let i in firstQuery) result[i].request_id = firstQuery[i].request_id;
        
        console.log('this is sthe result of first query', firstQuery);
        res.json({result: result});
    })();
});

app.post('/acceptRequest', (req, res) => {
    let requestDetails = req.body;
    console.log(requestDetails);

    conn.query(`UPDATE user_request SET request_status = 'accepted' WHERE request_id = ${requestDetails.request_id}`, (err) => {
        if (err) throw err;
        res.json({message: 'updated successfully'});
    });
});

app.post('/declineRequest', (req, res) => {
    let requestDetails = req.body;

    conn.query(`UPDATE user_request SET request_status = 'declined' WHERE request_id = ${requestDetails.request_id}`, (err) => {
        if (err) throw err;
        res.json({message: 'declined successfully'});
    });
});

app.get('/getFriends', (req, res) => {
    conn.query = util.promisify(conn.query);    
    let currentUser = req.query.current_user;

    (async () => {
        const firstQuery = await conn.query(`SELECT request_id, request_sender, request_receiver FROM user_request WHERE (request_receiver = '${currentUser}' OR request_sender = '${currentUser}') AND request_status = 'accepted'`).then((result) => { return result });

        const secondQuery = firstQuery.map((item) => {
            let temp = item.request_sender === currentUser ? item.request_receiver : item.request_sender;

            return conn.query(`SELECT * FROM users WHERE uid = '${temp}'`);
        });

        let result = await Promise.all(secondQuery);
        result = result.flatMap((item) => { return item });
        for (let i in firstQuery) result[i].request_id = firstQuery[i].request_id;

        res.json({result: result});
    })();
});

app.post('/removeFriend', (req, res) => {
    let requestDetails = req.body;

    console.log(requestDetails);
    conn.query(`DELETE FROM user_request WHERE request_id = ${requestDetails.request_id}`, (err) => {
        if (err) throw 'error remove friend', err;
        res.json({success: 'friend deleted successfully'});
    });
});

app.post('/sendMessage', (req, res) => {
    conn.query = util.promisify(conn.query);
    let { currentUser, getMessageContent, getMessageReceiver } = req.body;
    console.log(getMessageContent);

    let conversation_name = [currentUser.display_name.replace(' ', '_'), getMessageReceiver.display_name.replace(' ', '_')].sort();
    conversation_name = `${conversation_name[0]}-${conversation_name[1]}`;

    (async () => {
        const firstQuery = await conn.query(`SELECT conversation_id FROM conversation_container WHERE conversation_name = "${conversation_name}"`).then((result) => { 
            if (result.length == 0) {
                conn.query(`INSERT INTO conversation_container (conversation_name, conversation_timestamp) VALUES ("${conversation_name}", "${getDate()}")`).then((result) => {
                    console.log(result.insertId);
                    return [{conversation_id: result.insertId}];
                });
            }
            return result;
        });

        firstQuery.map((item) => {
            conn.query(`INSERT INTO conversation_messages (message_content, message_sender, message_receiver, conversation_id, message_timestamp) VALUES ('${getMessageContent.messageContent}', '${currentUser.uid}', '${getMessageReceiver.uid}', ${item.conversation_id}, '${getDate()}')`);
        });

        console.log(getDate());

        res.json({message: 'success'})
    })();
});

app.post('/conversation', (req, res) => {
    conn.query = util.promisify(conn.query);
    let { currentUser, messageReceiver } = req.body;

    let conversation_name = [currentUser.display_name.replace(' ', '_'), messageReceiver.display_name.replace(' ', '_')].sort();
    conversation_name = `${conversation_name[0]}-${conversation_name[1]}`;

    (async () => {
        const firstQuery = await conn.query(`SELECT * FROM conversation_container WHERE conversation_name = "${conversation_name}"`).then((result) => { return result });

        const secondQuery = firstQuery.map((item) => {
            return conn.query(`SELECT * FROM conversation_messages WHERE conversation_id = ${item.conversation_id}`);
        });      

        let result = await Promise.all(secondQuery);
        result = result.flatMap((item) => { return item });

        res.json({message: [firstQuery, result]});
    })();
});

app.get('/getMessagesPerTick', (req, res) => {
    const lastMessageTimestamp = req.query.lastMessageTimestamp;
    const conversation_id = req.query.conversation_id;

    conn.query(`SELECT * FROM conversation_messages WHERE message_timestamp > '${lastMessageTimestamp}' AND conversation_id = ${conversation_id}`, (err, result) => {
        if (err) throw err;
        res.json({message: result});
    });
});

app.listen(2020, () => console.log('connected to server js'));