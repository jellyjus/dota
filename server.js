"use strict";

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const request = require('request');

class Server {
    constructor() {
        this.init();
    }

    init() {
        this.app = express();
        this.server = http.createServer(this.app);

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(express.static(__dirname + '/client'));

        this.createServer();
        this.createRoutes();
        this.initFirebase();
    }

    createServer() {
        const port = 8080;

        this.server.listen(port, () =>
            console.log(`Start listening on port ${port}`)
        );

    }

    initFirebase() {
        this.firebase = require("firebase");
        const serviceAccount = require(__dirname + "/firebase.json");

        this.firebase.initializeApp({
            serviceAccount,
            databaseURL: "https://bets-30943.firebaseio.com"
        });
    }

    createRoutes() {
        this.app.post('/api/setToken', (req, res) => {
            const token = req.body.token;
            console.log('setToken', token);
            this.firebase.database().ref(`/${token}`).set(true);

        });

        this.app.get('/api/send', (req, res) => {
            const title = req.query.title || 'Empty title';
            const message = req.query.msg || 'Empty message';

            this.firebase.database().ref('/').once('value')
            .then(snapshot => {
                const users = Object.keys(snapshot.val());
                const data = {
                    notification: {
                        title,
                        body: message,
                        icon: "https://pp.userapi.com/c10053/g19730218/d_9d52cfdd.jpg",
                        click_action: "http://scan-sport.com/vilki/"
                    },
                    registration_ids: users
                };
                const options = {
                    url: 'https://fcm.googleapis.com/fcm/send',
                    method: 'POST',
                    headers: {
                        'Authorization': 'key=AAAAFsZ2MSY:APA91bH95dpY5HC5ndKal5su3T7dqy7WwdkZ3A_Qg5IH4RiwPh225Z_bgyZVmdBbkapRrrdpN7wiGNdR6aedh1q13BzXZE0Zv2WQksOm33vzibflPwZTvr-B0yZrk6yvGsEeZzhFQH_O'
                    },
                    json: true,
                    body : data
                };

                request(options, (err, response, body) => {
                    if (err)
                        return res.end(JSON.stringify(err));

                    res.end(JSON.stringify(body));
                })
            });

        });
    }
}

new Server();
