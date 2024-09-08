// LFG
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
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

const date = new Date();
let year = date.toLocaleString('default' , { year: 'numeric' });
let month = date.toLocaleString('default', { month: '2-digit' });
let day = date.toLocaleString('default', { day: '2-digit' });

const currentDate = `${year}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

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

    conn.query(`INSERT INTO user_request (request_sender, request_receiver, request_status, timestamp) VALUES ('${currentUser[0].uid}', '${requestReceiver.uid}', 'pending', '${currentDate}')`, (err) => {
        if (err) throw err;
        res.json({message: 'Friend request sent'});
    });
});

app.get('/getRequests', (req, res) => {
    let currentUser = req.query.current_user;

    conn.query(`SELECT request_id, request_sender FROM user_request WHERE request_receiver = '${currentUser}' AND request_status = 'pending'`, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
            let resultOne = result;
            resultOne.map((element, index) => {
                conn.query(`SELECT * FROM users WHERE uid = '${element.request_sender}'`, (err, result) => {
                    if (err) throw err;
                    result[index].request_sender = element.request_sender;
                    result[index].request_id = element.request_id;
                    res.json({result: result});
                });
            });
        } else {
            res.json({result: []});
        }
    });
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
    let currentUser = req.query.current_user;

    conn.query(`SELECT request_id, request_sender, request_receiver FROM user_request WHERE (request_receiver = '${currentUser}' OR request_sender = '${currentUser}') AND request_status = 'accepted'`, (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
            let resultOne = result;
            resultOne.map((element, index) => {
                let temp;
                element.request_sender === currentUser ? temp = element.request_receiver : temp = element.request_sender; 

                conn.query(`SELECT * FROM users WHERE uid = '${temp}'`, (err, result) => {
                    if (err) throw err;
                    result[index].request_sender = element.request_sender;
                    result[index].request_id = element.request_id;
                    res.json({result: result});
                });
            });
        } else {
            res.json({result: []});
        }
    });
});

app.post('/removeFriend', (req, res) => {
    let requestDetails = req.body;

    conn.query(`DELETE FROM user_request WHERE request_id = ${requestDetails.request_id}`, (err) => {
        if (err) throw err;
        res.json({success: 'friend deleted successfully'});
    });
});

app.listen(2020, () => console.log('connected to server js'));