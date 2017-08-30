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

        this.token = '';

        this.createServer();
        this.createRoutes();
    }

    createServer() {
        const port = 8080;

        this.server.listen(port, () =>
            console.log(`Start listening on port ${port}`)
        );

    }

    createRoutes() {
        this.app.post('/api/setToken', (req, res) => {
            this.token = req.body.token;
            console.log('setToken', this.token)
        });

        this.app.get('/api/send', (req, res) => {
            const title = req.query.title || 'Empty title';
            const message = req.query.msg || 'Empty message';
            const data = {
                notification: {
                    title: "Ералаш",
                    body: "Начало в 21:00",
                    icon: "https://pp.userapi.com/c10053/g19730218/d_9d52cfdd.jpg",
                    click_action: "https://vk.com/feed"
                },
                to: "fMauLQLH9nk:APA91bEJfI0L91MHth5tYHVoHLULjpj66wjQlpFPQbmAX_EGXB9vPz7GvS1B3mdTI9qwj6AmrY-1a7r8OKnYtU570TGkMhLDNKXG0EtTOSEkv2dUPj36RAX_K5Wc4_Vz6xoMPAZPkRLK"
            };
            const options = {
                url: 'https://fcm.googleapis.com/fcm/send',
                method: 'POST',
                headers: {
                    'Authorization': 'key=AAAAFsZ2MSY:APA91bHoaUlbEJak5Mqnub3rXOsEeU1CNIzD81Jb1nSA3L2Luo0RKTADpUlBR6Iab7egzkdXVcgE0ZKXOzr-MdVH3J0E6B3c_eKLWKttrSlJF21EC3KGItH_pGM350TSIX0a17pEopLb'
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
    }
}

new Server();
