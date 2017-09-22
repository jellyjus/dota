const express = require('express');
const bodyParser = require('body-parser');

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
            const query = req.query;
            console.log(query);

            const teams = (query.teams)? query.teams.split(':') : null;
            res.render("index", {
                teams
            });
        });

        this.app.get('/favicon.ico', (req, res) => {
            res.end('ok')
        });

        this.app.post('/new_match', (req, res) => {
            const body = req.body;
        });

        this.app.get('/:url', (req, res) => {
            this.matches = require('./matches.json');
            const url = req.params.url;
            if (this.matches[url]) {
                let data = this.matches[url];
                for (let team of data.teams)
                    data[team] = this.teams[team].join(' | ') || null;

                res.render('index', data)
            }
        })
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
