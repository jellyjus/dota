const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

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

        });

        this.app.get('/api/send', (req, res) => {
            const title = req.query.title || 'Empty title';
            const message = req.query.msg || 'Empty message';

            const options = {
                hostname: 'fcm.googleapis.com',
                port: 80,
                path: '/fcm/send',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AAAAFsZ2MSY:APA91bHoaUlbEJak5Mqnub3rXOsEeU1CNIzD81Jb1nSA3L2Luo0RKTADpUlBR6Iab7egzkdXVcgE0ZKXOzr-MdVH3J0E6B3c_eKLWKttrSlJF21EC3KGItH_pGM350TSIX0a17pEopLb'
                }
            };

            const postData = querystring.stringify({
                "notification": {
                    "title": "Ералаш",
                    "body": "Начало в 21:00",
                    "icon": "https://pp.userapi.com/c10053/g19730218/d_9d52cfdd.jpg",
                    "click_action": "https://vk.com/feed"
                },
                "to": this.token
            });

            const request = http.request(options, (response) => {
                console.log(`STATUS: ${response.statusCode}`);
                console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
                response.setEncoding('utf8');
                response.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                });
                response.on('end', () => {
                    console.log('No more data in response.');
                });
            });

            request.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
            });

            request.write(postData);
            request.end();
        });
    }
}

new Server();
