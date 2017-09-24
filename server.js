const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const utils = require('./utils');

class Server {
    constructor() {
        this.app = express();
        this.setup();
    }

    setup() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(express.static(__dirname + '/frontend/assets'));

        this.teams = require('./teams.json');

        this.createRoutes();
        this.createServer();
    }

    createRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/frontend/templates/match.html')
        });

        this.app.get('/teams.json', (req, res) => {
            const teams = require('./teams.json');
            res.json(teams)
        });

        this.app.get('/:url', (req, res) => {
            this.matches = require('./matches.json');
            const url = req.params.url;
            this.log('GET', url);
            if (this.matches[url]) {
                let match = this.matches[url];
                match.id = url;

                let file = fs.readFileSync(__dirname + '/frontend/templates/match.html', 'utf8');
                file += `
                    <script>
                         Object.assign(app.$data, ${JSON.stringify(match)})
                    </script>
                `;
                res.end(file)
            }
            else
                res.end('NOT FOUND');
        });

        this.app.post('/createMatch', (req, res) => {
            this.matches = require('./matches.json');
            const body = req.body;
            let id;
            do {
                id = utils.randStr();
            } while(this.matches.hasOwnProperty(id));
            this.matches[id] = body;
            fs.writeFileSync(__dirname + '/matches.json', JSON.stringify(this.matches, null, 2));
            this.log(`Match #${id} created`, body);
            res.json({redirect: `/${id}`});
        });

        this.app.post('/saveMatch', (req, res) => {
            this.matches = require('./matches.json');
            const body = req.body;
            if (!body.id)
                return res.status(400).send('No id');

            this.matches[body.id] = body;
            fs.writeFileSync(__dirname + '/matches.json', JSON.stringify(this.matches, null, 2));
            this.log(`Match #${body.id} saved`, body);
            res.end('ok');
        });
    }

    log(...rest) {
        const date = utils.getDateTime();
        console.log(date, rest);
    }

    createServer() {
        const port = process.env.PORT || 8080;
        this.server = require('http').createServer(this.app);
        this.server.listen(port, () =>
            this.log(`Start listening on localhost:${port}`)
        );
    }
}

module.exports = new Server;
