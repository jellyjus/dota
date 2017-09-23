const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

class Server {
    constructor() {
        this.app = express();
        this.setup();
    }

    setup() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(express.static(__dirname + '/frontend/assets'));
        this.app.engine('ejs', require('ejs-locals'));
        this.app.set('views', __dirname + '/frontend/templates');
        this.app.set('view engine', 'ejs');

        this.teams = require('./teams.json');

        this.createRoutes();
        this.createServer();
    }

    createRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + '/frontend/templates/index.html')
        });

        this.app.get('/teams.json', (req, res) => {
            const teams = require('./teams.json');
            res.json(teams)
        });

        this.app.post('/new_match', (req, res) => {
            const body = req.body;
        });

        this.app.get('/:url', (req, res) => {
            this.matches = require('./matches.json');
            const url = req.params.url;
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

        this.app.post('/saveMatch', (req, res) => {
            const body = req.body;
            this.matches[body.id] = body;
            fs.writeFileSync(__dirname + '/matches.json', JSON.stringify(this.matches, null, 2));
            res.end('ok');
        });
    }

    createServer() {
        const port = 8080 || process.env.NODE_PORT;
        this.server = require('http').createServer(this.app);
        this.server.listen(port, () =>
            console.log(`Start listening on localhost:${port}`)
        );
    }
}

module.exports = new Server;
